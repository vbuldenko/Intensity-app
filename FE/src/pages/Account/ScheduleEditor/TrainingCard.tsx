import React, { useState, useTransition } from "react";
import { ScheduleTraining } from "../../../types/Schedule";
import { User } from "../../../types/User";

interface TrainingCardProps {
  training: ScheduleTraining;
  trainers: User[];
  onUpdate: (training: ScheduleTraining) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({
  training,
  trainers,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTraining, setEditedTraining] = useState({
    ...training,
    instructor: training.instructor?.id,
  });
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await onUpdate(editedTraining);
        setIsEditing(false);
      } catch (error) {
        // Error handling will be done by parent component
        console.error("Failed to update training:", error);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await onDelete(training.id);
      } catch (error) {
        console.error("Failed to delete training:", error);
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTraining((prev) => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <div className="schedule-editor__training card-element text-sm">
        <div className="schedule-editor__edit-form">
          <label>
            Type:
            <input
              type="text"
              name="type"
              value={editedTraining.type}
              onChange={handleChange}
              disabled={isPending}
            />
          </label>
          <label>
            Instructor:
            <select
              name="instructor"
              value={editedTraining.instructor}
              onChange={handleChange}
              disabled={isPending}
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
              type="number"
              name="maxCapacity"
              value={editedTraining.maxCapacity}
              onChange={handleChange}
              disabled={isPending}
            />
          </label>
          <label>
            Time:
            <input
              type="time"
              name="time"
              value={editedTraining.time}
              onChange={handleChange}
              disabled={isPending}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <button
              className="schedule-editor__save-btn bg-lime-500"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              className="schedule-editor__save-btn bg-teal-500"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              className="schedule-editor__save-btn bg-red-500"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-editor__training card-element text-sm">
      <div className="schedule-editor__info">
        <p>Type: {training.type}</p>
        <p>Instructor: {training.instructor?.firstName}</p>
        <p>Max Capacity: {training.maxCapacity}</p>
        <p>Time: {training.time}</p>
        <button
          className="schedule-editor__edit-btn bg-blue-400"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};
