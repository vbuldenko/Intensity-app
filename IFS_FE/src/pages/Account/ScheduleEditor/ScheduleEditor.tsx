import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ScheduleTraining } from "../../../types/Schedule";
import { scheduleService } from "../../../services/scheduleService";
import "./ScheduleEditor.scss";

interface DaySchedule {
  day: string;
  trainings: ScheduleTraining[];
}

const ScheduleEditor: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleTraining[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [editableTraining, setEditableTraining] =
    useState<ScheduleTraining | null>(null);

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

  const handleEdit = (training: ScheduleTraining) => {
    setEditableTraining(training);
  };

  const handleSave = () => {
    if (editableTraining) {
      scheduleService
        .updateTraining(editableTraining.id, editableTraining)
        .then(() => {
          setScheduleData((prev) =>
            prev.map((daySchedule) => ({
              ...daySchedule,
              trainings: daySchedule.trainings.map((training) =>
                training.id === editableTraining.id
                  ? editableTraining
                  : training
              ),
            }))
          );
          setEditableTraining(null);
        });
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

  // Group trainings by day
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const groupedSchedule = daysOfWeek.map((day) => ({
    day,
    trainings: schedule.filter((training) => training.day === day),
  }));

  return (
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
                      Instructor ID:
                      <input
                        type="text"
                        name="instructorId"
                        value={editableTraining.instructorId}
                        onChange={handleChange}
                      />
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
                    <button
                      className="schedule-editor__save-btn"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="schedule-editor__info">
                    <p>Type: {training.type}</p>
                    <p>Instructor ID: {training.instructorId}</p>
                    <p>Max Capacity: {training.maxCapacity}</p>
                    <p>Time: {training.time}</p>
                    <button
                      className="schedule-editor__edit-btn"
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
  );
};

export default ScheduleEditor;
