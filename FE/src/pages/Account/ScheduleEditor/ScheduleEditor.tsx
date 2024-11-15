import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ScheduleTraining } from "../../../types/Schedule";
import { scheduleService } from "../../../services/scheduleService";
import { getErrorMessage, groupTrainingsByDay } from "../../../utils/utils";
import { trainingService } from "../../../services/trainingService";
import "./ScheduleEditor.scss";
import Notification from "../../../components/Elements/Notification";
import { User } from "../../../types/User";
import { userService } from "../../../services/userService";

const ScheduleEditor: React.FC = () => {
  const [trainers, setTrainers] = useState<User[]>([]);
  const [schedule, setSchedule] = useState<ScheduleTraining[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [editableTraining, setEditableTraining] =
    useState<ScheduleTraining | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const data = await scheduleService.getSchedule();
        setSchedule(data);
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
      }
    };

    fetchScheduleData();
  }, []);

  useEffect(() => {
    userService.getTrainers().then(setTrainers);
  }, []);

  const handleEdit = (training: ScheduleTraining) => {
    setEditableTraining(training);
  };

  const handleSave = () => {
    if (editableTraining) {
      scheduleService
        .updateTraining(editableTraining.id, editableTraining)
        .then((updatedTraining) => {
          setSchedule((prev) =>
            prev.map((training) =>
              training.id === updatedTraining.id ? updatedTraining : training
            )
          );
        })
        .finally(() => setEditableTraining(null));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (editableTraining) {
      setEditableTraining({
        ...editableTraining,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleInitialization = async () => {
    if (selectedDate) {
      setIsSubmitting(true);
      try {
        const startDate = new Date(selectedDate);
        const day = startDate.getDate();
        await trainingService.initializeWeek(day);
        setNotification("Successfully initialized week");
      } catch (error) {
        setError(getErrorMessage(error) || "error occured");
      } finally {
        setIsSubmitting(false);

        setTimeout(() => {
          setError(null);
          setNotification(null);
        }, 5000);
      }
    } else
      setError("Error initializing week: selectedDate is not defined or empty");
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const groupedSchedule = groupTrainingsByDay(schedule);

  return (
    <>
      {notification && <Notification message={notification} />}
      {error && <Notification message={error} type="error" />}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4 mt-2">
        <div className="relative flex-1">
          <input
            type="date"
            className="text-teal-600 bg-gray-100 py-1 px-6 rounded-xl w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {!selectedDate && (
            <label className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              Select a date
            </label>
          )}
        </div>

        <div className="card-element flex-1 p-1 text-center bg-teal-500 text-white">
          <button
            className="init w-full flex items-center justify-center min-h-6"
            onClick={handleInitialization}
          >
            {isSubmitting && <div className="reservation-btn__spinner"></div>}
            {!isSubmitting && "Initialize from selected date"}
          </button>
        </div>
      </div>
      <div className="schedule-editor">
        {groupedSchedule.map((daySchedule) => (
          <div className="schedule-editor__day" key={daySchedule.day}>
            <div
              className="schedule-editor__day-header"
              onClick={() =>
                setExpandedDay(
                  expandedDay === daySchedule.day ? null : daySchedule.day
                )
              }
            >
              <span>{daySchedule.day}</span>
              <span
                className={`schedule-editor__chevron ${
                  expandedDay === daySchedule.day
                    ? "schedule-editor__chevron--open"
                    : "schedule-editor__chevron--closed"
                }`}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </span>
            </div>
            <div
              className={`schedule-editor__day-content ${expandedDay === daySchedule.day ? "schedule-editor__day-content--expanded" : ""}`}
            >
              {daySchedule.trainings.map((training) => (
                <div
                  className="schedule-editor__training card-element text-sm"
                  key={training.id}
                >
                  {editableTraining?.id === training.id ? (
                    <div className="schedule-editor__edit-form">
                      <label>
                        Type:
                        <input
                          type="text"
                          name="type"
                          value={editableTraining.type}
                          onChange={handleChange}
                        />
                      </label>
                      <label>
                        Instructor:
                        <select
                          name="instructor"
                          value={editableTraining.instructor}
                          onChange={handleChange}
                        >
                          <option value="">Select a trainer</option>
                          {trainers.map((trainer) => (
                            <option key={trainer.id} value={trainer.id}>
                              {trainer.firstName} {trainer.lastName}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Max Capacity:
                        <input
                          type="text"
                          name="maxCapacity"
                          value={editableTraining.maxCapacity}
                          onChange={handleChange}
                        />
                      </label>
                      <label>
                        Time:
                        <input
                          type="text"
                          name="time"
                          value={editableTraining.time}
                          onChange={handleChange}
                        />
                      </label>
                      <div className="flex gap-4">
                        <button
                          className="schedule-editor__save-btn bg-lime-500"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="schedule-editor__save-btn bg-teal-500"
                          onClick={() => setEditableTraining(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="schedule-editor__info">
                      <p>Type: {training.type}</p>
                      <p>Instructor: {training.instructor?.firstName}</p>
                      <p>Max Capacity: {training.maxCapacity}</p>
                      <p>Time: {training.time}</p>
                      <button
                        className="schedule-editor__edit-btn bg-blue-400"
                        onClick={() => handleEdit(training)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ScheduleEditor;
