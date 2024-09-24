import React, { useEffect, useState } from "react";
import { scheduleService } from "../../../services/scheduleService";

interface Training {
  time: string;
  type: string;
  instructor: string | null;
  maxCapacity: number;
}

interface DayScheduleProps {
  day: string;
  trainings: Training[];
}

const ScheduleEditor: React.FC = () => {
  const [schedule, setSchedule] = useState<any>({});
  const [editableTraining, setEditableTraining] = useState<Training | null>(
    null
  );
  const [editableDay, setEditableDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const fetchedSchedule = await scheduleService.getSchedule();
        setSchedule(fetchedSchedule);
        setLoading(false);
      } catch (error) {
        setError("Failed to load schedule.");
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const handleEdit = (day: string, index: number) => {
    setEditableTraining(schedule[day][index]);
    setEditableDay(day);
  };

  const handleSave = async (index: number) => {
    if (editableDay && editableTraining) {
      const updatedTrainings = [...schedule[editableDay]];
      updatedTrainings[index] = editableTraining;

      // Update the schedule in the backend
      try {
        await updateSchedule(editableDay, updatedTrainings);
        setSchedule({
          ...schedule,
          [editableDay]: updatedTrainings,
        });
        setEditableTraining(null);
        setEditableDay(null);
      } catch (error) {
        setError("Failed to update schedule.");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Training
  ) => {
    if (editableTraining) {
      setEditableTraining({
        ...editableTraining,
        [field]: e.target.value,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="accordion">
      {Object.keys(schedule).map((day, dayIndex) => (
        <div key={dayIndex} className="accordion__day">
          <button className="accordion__button">{day}</button>
          <div className="accordion__content">
            {schedule[day].map((training: Training, index: number) => (
              <div key={index} className="accordion__training">
                {editableTraining &&
                editableDay === day &&
                editableTraining === training ? (
                  <div className="accordion__training--editable">
                    <input
                      type="time"
                      value={editableTraining.time}
                      onChange={(e) => handleChange(e, "time")}
                      className="accordion__input"
                    />
                    <select
                      value={editableTraining.type}
                      onChange={(e) => handleChange(e, "type")}
                      className="accordion__select"
                    >
                      <option value="Healthy Back">Healthy Back</option>
                      <option value="TRX">TRX</option>
                      <option value="Fly Stretching">Fly Stretching</option>
                      <option value="Pilates">Pilates</option>
                      <option value="Tabata">Tabata</option>
                      <option value="Soft & Relax Stretching">
                        Soft & Relax Stretching
                      </option>
                      <option value="Шпагат + Постава">Шпагат + Постава</option>
                    </select>
                    <input
                      type="number"
                      value={editableTraining.maxCapacity}
                      onChange={(e) => handleChange(e, "maxCapacity")}
                      className="accordion__input"
                    />
                    <button
                      className="accordion__save"
                      onClick={() => handleSave(index)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="accordion__training--view">
                    <span>{training.time}</span> - <span>{training.type}</span>{" "}
                    - <span>{training.maxCapacity}</span>
                    <button
                      className="accordion__edit"
                      onClick={() => handleEdit(day, index)}
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
