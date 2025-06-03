// components/ScheduledTrainings.tsx
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { UsersIcon } from "@heroicons/react/24/solid";
import { Training } from "../../../../../types/Training";
import {
  DayOption,
  useTrainingsByDay,
} from "../../../../../hooks/useTrainingsByDay";
import TrainerTrainingCard from "../TrainerTrainingCard";
import DaySelector from "../../../../../components/Buttons/DaySelector";
import "./ScheduledTraining.scss";

interface ScheduledTrainingsProps {
  /** All available trainings to filter from */
  trainings: Training[];
  /** Initial title for the component */
  title?: string;
  /** Initial day selection */
  initialDay?: DayOption;
  /** Initial custom date if using custom day */
  initialCustomDate?: Date;
  /** Initial sort order */
  initialSortOrder?: "asc" | "desc";
  /** Show/hide the people counter */
  showCounter?: boolean;
  /** Show/hide the day selector */
  showDaySelector?: boolean;
  /** Show/hide the sort controls */
  showSortControls?: boolean;
  /** Custom empty state message */
  emptyStateMessage?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom training card component */
  TrainingCardComponent?: React.ComponentType<{ training: Training }>;
}

const ScheduledTrainings: React.FC<ScheduledTrainingsProps> = ({
  trainings,
  title,
  initialDay = "today",
  initialCustomDate,
  initialSortOrder = "asc",
  showCounter = true,
  showDaySelector = true,
  showSortControls = false,
  emptyStateMessage,
  className = "",
  TrainingCardComponent = TrainerTrainingCard,
}) => {
  const { t } = useTranslation();

  // State management
  const [selectedDay, setSelectedDay] = useState<DayOption>(initialDay);
  const [customDate, setCustomDate] = useState<Date | undefined>(
    initialCustomDate
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);

  // Get filtered and sorted trainings
  const {
    trainings: filteredTrainings,
    totalReservations,
    isEmpty,
  } = useTrainingsByDay({
    trainings,
    selectedDay,
    customDate,
    sortOrder,
  });

  // Event handlers
  const handleDayChange = useCallback((day: DayOption) => {
    setSelectedDay(day);
  }, []);

  const handleCustomDateChange = useCallback((date: Date) => {
    setCustomDate(date);
  }, []);

  // Dynamic title generation
  const getDynamicTitle = useCallback(() => {
    if (title) return title;

    const dayLabels = {
      today: t("common.today"),
      tomorrow: t("common.tomorrow"),
      yesterday: t("common.yesterday"),
      custom: customDate?.toLocaleDateString() || t("common.customDate"),
    };

    return `${t("common.trainings")} - ${dayLabels[selectedDay]}`;
  }, [title, selectedDay, customDate, t]);

  return (
    <div
      className={`pt-10 scheduled-trainings card-element relative ${className}`}
    >
      {/* Header Section */}
      <div className="scheduled-trainings__header">
        <div className="scheduled-trainings__title-row">
          <h3 className="scheduled-trainings__title">{getDynamicTitle()}</h3>

          {showCounter && (
            <div className="people-counter">
              <UsersIcon className="size-4" />
              <span>{totalReservations}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {showDaySelector && (
        <DaySelector
          className="my-4"
          size="sm"
          selectedDay={selectedDay}
          customDate={customDate}
          onDayChange={handleDayChange}
          onCustomDateChange={handleCustomDateChange}
        />
      )}

      {showSortControls && (
        <div className="flex my-2">
          <div className="flex items-center gap-3">
            {/* <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t("common.sort")}
            </span> */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setSortOrder("asc")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  sortOrder === "asc"
                    ? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t("common.earliest")}</span>
              </button>
              <button
                onClick={() => setSortOrder("desc")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  sortOrder === "desc"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t("common.latest")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trainings List */}
      <div className="scheduled-trainings__list">
        {!isEmpty ? (
          filteredTrainings.map((training) => (
            <TrainingCardComponent key={training.id} training={training} />
          ))
        ) : (
          <div className="scheduled-trainings__empty-state">
            <p className="text-gray-500 text-center">
              {emptyStateMessage || t("trainerOverview.noTrainings")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledTrainings;
