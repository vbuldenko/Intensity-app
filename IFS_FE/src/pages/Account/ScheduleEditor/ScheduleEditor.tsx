import React, { useEffect, useState } from "react";
import { ScheduleTraining } from "../../../types/Schedule";
import { scheduleService } from "../../../services/scheduleService";
import "./ScheduleEditor.scss"; 

const ScheduleEditor: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleTraining[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editableSchedule, setEditableSchedule] = useState<ScheduleTraining | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const data = await scheduleService.getSchedule();
        setScheduleData(data);
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
      }
    };

    fetchScheduleData();
  }, []);

  const handleEdit = (schedule: ScheduleTraining) => {
    setEditableSchedule(schedule);
  };

  const handleSave = () => {
    if (editableSchedule) {
      scheduleService.updateTraining(editableSchedule.id, editableSchedule).then(() => {
        setScheduleData((prev) =>
          prev.map((schedule) =>
            schedule.id === editableSchedule.id ? editableSchedule : schedule
          )
        );
        setEditableSchedule(null);
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editableSchedule) {
      setEditableSchedule({ ...editableSchedule, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="schedule">
      {scheduleData.map((schedule: ScheduleTraining) => (
        <div className="schedule__item" key={schedule.id}>
          <div className="schedule__header" onClick={() => setExpanded(expanded === schedule.id ? null : schedule.id)}>
            <span>{schedule.day} - {schedule.time}</span>
          </div>
          {expanded === schedule.id && (
            <div className="schedule__content">
              {editableSchedule?.id === schedule.id ? (
                <div className="schedule__edit-form">
                  <label>
                    Type:
                    <input
                      type="text"
                      name="type"
                      value={editableSchedule.type}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Instructor ID:
                    <input
                      type="text"
                      name="instructorId"
                      value={editableSchedule.instructorId}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Max Capacity:
                    <input
                      type="text"
                      name="maxCapacity"
                      value={editableSchedule.maxCapacity}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="text"
                      name="time"
                      value={editableSchedule.time}
                      onChange={handleChange}
                    />
                  </label>
                  <button className="schedule__save-btn" onClick={handleSave}>
                    Save
                  </button>
                </div>
              ) : (
                <div className="schedule__info">
                  <p>Type: {schedule.type}</p>
                  <p>Instructor ID: {schedule.instructorId}</p>
                  <p>Max Capacity: {schedule.maxCapacity}</p>
                  <p>Time: {schedule.time}</p>
                  <button className="schedule__edit-btn" onClick={() => handleEdit(schedule)}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScheduleEditor;
