import React, { useState, useTransition } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { trainingService } from "../../../services/trainingService";
import { getErrorMessage } from "../../../utils/utils";
import { groupTrainingsByDay } from "../../../utils/trainings";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Notification from "../../../components/Elements/Notification";
import "./ScheduleEditor.scss";
import { useScheduleData } from "../../../hooks/useScheduleData";
import { useNotification } from "../../../hooks/useNewNotification";
import { useOptimisticSchedule } from "../../../hooks/useOptimisticSchedule";
import { TrainingCard } from "./TrainingCard";
import { AddTrainingModal } from "./AddTrainingModal";

const ScheduleEditor: React.FC = () => {
  const { t } = useTranslation();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isInitPending, startInitTransition] = useTransition();
  const [addTrainingModal, setAddTrainingModal] = useState<{
    isOpen: boolean;
    day: string | null;
  }>({ isOpen: false, day: null });

  const { trainers, schedule, isLoading, error: dataError } = useScheduleData();
  const { notification, error, showNotification, showError } =
    useNotification();
  const { optimisticSchedule, updateTraining, deleteTraining, addTraining } =
    useOptimisticSchedule(schedule);

  const handleInitialization = () => {
    if (!selectedDate) {
      showError("Please select a date");
      return;
    }

    startInitTransition(async () => {
      try {
        const startDate = new Date(selectedDate);
        await trainingService.initializeWeek(
          startDate.getDate(),
          startDate.getMonth()
        );
        showNotification("Successfully initialized week");
      } catch (error) {
        showError(getErrorMessage(error) || "Failed to initialize week");
      }
    });
  };

  const toggleDay = (day: string) => {
    setExpandedDay((current) => (current === day ? null : day));
  };

  const handleAddTraining = (day?: string) => {
    if (!day) {
      setAddTrainingModal({ isOpen: true, day: null });
      return;
    }

    setAddTrainingModal({
      isOpen: true,
      day,
    });
  };

  const handleCloseModal = () => {
    setAddTrainingModal({ isOpen: false, day: null });
  };

  const handleTrainingAdded = (
    newTraining: any,
    isScheduleUpdate?: boolean
  ) => {
    addTraining(newTraining);
    showNotification(
      isScheduleUpdate
        ? `Schedule updated successfully`
        : `Training added successfully`
    );
    handleCloseModal();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-500">Loading schedule data...</div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">Error: {dataError}</div>
      </div>
    );
  }

  const groupedSchedule = groupTrainingsByDay(optimisticSchedule);

  return (
    <>
      {notification && <Notification message={notification} />}
      {error && <Notification message={error} type="error" />}

      {/* Date Selection and Initialization */}
      <div className="flex flex-wrap items-center justify-between my-4 gap-4">
        <label className="flex-1 flex gap-4 items-center justify-between w-full">
          <span className="px-2 w-max text-gray-500">
            {t("scheduleEditor.selectDate")}
          </span>
          <input
            type="date"
            className="flex-1 bg-gray-100 text-teal-400 py-1 px-6 rounded-xl"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={isInitPending}
          />
        </label>

        <div className="min-w-max flex-1 p-2 text-center bg-teal-500 text-white rounded-xl">
          <button
            className="init w-full flex items-center justify-center min-h-6"
            onClick={handleInitialization}
            disabled={isInitPending}
          >
            {isInitPending ? (
              <div className="reservation-btn__spinner"></div>
            ) : (
              t("scheduleEditor.initBtn")
            )}
          </button>
        </div>
      </div>

      {/* Schedule Display */}
      <div className="schedule-editor">
        {groupedSchedule.map((daySchedule) => (
          <div className="schedule-editor__day" key={daySchedule.day}>
            <div
              className="schedule-editor__day-header"
              onClick={() => toggleDay(daySchedule.day)}
            >
              <span>{daySchedule.day}</span>
              <span
                className={classNames("schedule-editor__chevron", {
                  "schedule-editor__chevron--open":
                    expandedDay === daySchedule.day,
                  "schedule-editor__chevron--closed":
                    expandedDay !== daySchedule.day,
                })}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </span>
            </div>

            <div
              className={classNames("schedule-editor__day-content", {
                "schedule-editor__day-content--expanded":
                  expandedDay === daySchedule.day,
              })}
            >
              <button
                className="add-training-btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4 transition-colors self-center"
                onClick={() => handleAddTraining(daySchedule.day)}
              >
                <PlusIcon className="w-4 h-4" />
                Add to {daySchedule.day}
              </button>

              <div className="schedule-editor__trainings">
                {daySchedule.trainings.map((training) => (
                  <TrainingCard
                    key={training.id}
                    training={training}
                    trainers={trainers}
                    onUpdate={updateTraining}
                    onDelete={deleteTraining}
                  />
                ))}
                {daySchedule.trainings.length === 0 && (
                  <div className="text-gray-500 flex items-center justify-center w-full py-8">
                    No trainings scheduled for this day.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 add-training-btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4 transition-colors"
        onClick={() => handleAddTraining()}
      >
        <PlusIcon className="w-4 h-4" />
        Add training separately
      </button>

      {/* Add Training Modal */}
      <AddTrainingModal
        isOpen={addTrainingModal.isOpen}
        day={addTrainingModal.day}
        trainers={trainers}
        onClose={handleCloseModal}
        onSuccess={handleTrainingAdded}
        onError={showError}
      />
    </>
  );
};

export default ScheduleEditor;
