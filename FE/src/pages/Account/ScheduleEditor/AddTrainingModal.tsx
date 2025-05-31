import React, { useState, useTransition } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
// import { useTranslation } from "react-i18next";
import { trainingService } from "../../../services/trainingService";
import { Training } from "../../../types/Training";
import { User } from "../../../types/User";
import { scheduleService } from "../../../services/scheduleService";
import { ScheduleTraining } from "../../../types/Schedule";
import { WeekDays } from "../../../types/WeekDays";

interface AddTrainingModalProps {
  isOpen: boolean;
  day: string | null;
  trainers: User[];
  onClose: () => void;
  onSuccess: (
    training: Training | ScheduleTraining,
    isScheduleUpdate?: boolean
  ) => void;
  onError: (message: string) => void;
}

const initialTraining = {
  type: "",
  instructor: "",
  maxCapacity: 8,
  day: "",
  time: "",
  date: "",
};

export const AddTrainingModal: React.FC<AddTrainingModalProps> = ({
  isOpen,
  day,
  trainers,
  onClose,
  onSuccess,
  onError,
}) => {
  // const { t } = useTranslation();
  const [trainingData, setTrainingData] = useState<
    Omit<ScheduleTraining, "id"> & { date: string }
  >(initialTraining);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    if (isOpen && day) {
      setTrainingData((prev) => ({
        ...prev,
        day,
      }));
    }
  }, [isOpen, day]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTrainingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields: (keyof typeof trainingData)[] = [
      "type",
      "instructor",
      "maxCapacity",
      "time",
    ];
    const isValid = requiredFields.every((field) => trainingData[field]);

    if (!isValid) {
      onError("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      try {
        let newTraining;

        if (day) {
          newTraining = await scheduleService.addTraining(
            trainingData as Omit<ScheduleTraining, "id">
          );
        } else {
          newTraining = await trainingService.addTraining({
            type: trainingData.type,
            instructor: trainingData.instructor,
            day: trainingData.day,
            time: trainingData.time,
            date: trainingData.date,
            capacity: trainingData.maxCapacity,
          } as Omit<Training, "id">);
        }

        onSuccess(newTraining, !!day);
        setTrainingData(initialTraining);
      } catch (error) {
        onError(
          error instanceof Error ? error.message : "Failed to add training"
        );
      }
    });
  };

  const handleClose = () => {
    setTrainingData(initialTraining);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Training to {day}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isPending}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Training Type *
            </label>
            <input
              type="text"
              name="type"
              value={trainingData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Yoga, Pilates, HIIT"
              disabled={isPending}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructor *
            </label>
            <select
              name="instructor"
              value={trainingData.instructor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isPending}
              required
            >
              <option value="">Select an instructor</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.firstName} {trainer.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Capacity *
            </label>
            <input
              type="number"
              name="maxCapacity"
              value={trainingData.maxCapacity}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isPending}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              name="time"
              value={trainingData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isPending}
              required
            />
          </div>

          {!day && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day *
              </label>
              <select
                name="day"
                value={trainingData.day}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isPending}
                required
              >
                <option value="">Select a weekday</option>
                {Object.values(WeekDays).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!day && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={trainingData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isPending}
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="reservation-btn__spinner w-4 h-4 mr-2"></div>
                  Adding...
                </div>
              ) : (
                "Add Training"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
