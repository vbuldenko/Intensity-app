import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ScheduleTraining } from "../../../types/Schedule";
import { scheduleService } from "../../../services/scheduleService";
import { getErrorMessage } from "../../../utils/utils";
import { trainingService } from "../../../services/trainingService";
import "./ScheduleEditor.scss";
import Notification from "../../../components/Elements/Notification";
import { User } from "../../../types/User";
import { userService } from "../../../services/userService";
import classNames from "classnames";
import { groupTrainingsByDay } from "../../../utils/trainings";
import { Training } from "../../../types/Training";
import { WeekDays } from "../../../types/WeekDays";
import { useTranslation } from "react-i18next";

const ScheduleEditor: React.FC = () => {
  const { t } = useTranslation();
  const [trainers, setTrainers] = useState<User[]>([]);
  const [schedule, setSchedule] = useState<ScheduleTraining[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [editableTraining, setEditableTraining] =
    useState<ScheduleTraining | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTraining, setNewTraining] = useState<Partial<Training>>({
    type: "",
    instructor: "",
    capacity: 8,
    day: "",
    date: "",
    time: "",
  });

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
    } else {
      setNewTraining({
        ...newTraining,
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
        const month = startDate.getMonth() + 1;
        await trainingService.initializeWeek(day, month);
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

  const handleCreateTraining = async () => {
    if (
      newTraining.type &&
      newTraining.instructor &&
      newTraining.capacity &&
      newTraining.date &&
      newTraining.time
    ) {
      setIsSubmitting(true);
      try {
        await trainingService.addTraining(newTraining);
        // setSchedule((prev) => [...prev, createdTraining]);
        setNotification("Successfully created training");
        setNewTraining({
          type: "",
          instructor: "",
          capacity: 8,
          day: "",
          date: "",
          time: "",
        });
        setIsFormOpen(false);
      } catch (error) {
        setError(getErrorMessage(error) || "error occured");
      } finally {
        setIsSubmitting(false);

        setTimeout(() => {
          setError(null);
          setNotification(null);
        }, 5000);
      }
    } else {
      setError("Please fill in all fields");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const groupedSchedule = groupTrainingsByDay(schedule);

  return (
    <>
      {notification && <Notification message={notification} />}
      {error && <Notification message={error} type="error" />}
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
          />
        </label>

        <div className="min-w-max flex-1 p-2 text-center bg-teal-500 text-white rounded-xl">
          <button
            className="init w-full flex items-center justify-center min-h-6"
            onClick={handleInitialization}
          >
            {isSubmitting && <div className="reservation-btn__spinner"></div>}
            {!isSubmitting && t("scheduleEditor.initBtn")}
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
              className={classNames("schedule-editor__day-content", {
                "schedule-editor__day-content--expanded":
                  expandedDay === daySchedule.day,
              })}
            >
              <div className="schedule-editor__trainings">
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
          </div>
        ))}
      </div>

      <div className="schedule-editor__training card-element">
        <button
          className="schedule-editor__create-btn bg-pink-800 text-white py-1 px-4 rounded-xl"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen
            ? t("scheduleEditor.closeCreateForm")
            : t("scheduleEditor.createTraining")}
        </button>
        {isFormOpen && (
          <div className="schedule-editor__create-form schedule-editor__edit-form mt-4">
            <label>
              Type:
              <input
                type="text"
                name="type"
                value={newTraining.type}
                onChange={handleChange}
              />
            </label>
            <label>
              Instructor:
              <select
                name="instructor"
                value={newTraining.instructor}
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
              Capacity:
              <input
                type="text"
                name="maxCapacity"
                value={newTraining.capacity}
                onChange={handleChange}
              />
            </label>
            <label>
              Day:
              <select
                name="day"
                value={newTraining.day}
                onChange={handleChange}
              >
                <option value="">Select a weekday</option>
                {Object.values(WeekDays).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={newTraining.date}
                onChange={handleChange}
              />
            </label>
            <label>
              Time:
              <input
                type="text"
                name="time"
                value={newTraining.time}
                onChange={handleChange}
              />
            </label>
            <div className="flex gap-4">
              <button
                className="schedule-editor__save-btn bg-lime-500"
                onClick={handleCreateTraining}
              >
                Create
              </button>
              <button
                className="schedule-editor__save-btn bg-teal-500"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScheduleEditor;
