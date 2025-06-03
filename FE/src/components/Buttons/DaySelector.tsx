import React from "react";
import { useTranslation } from "react-i18next";
import { CalendarIcon } from "@heroicons/react/24/outline";

export type DayOption = "today" | "tomorrow" | "yesterday" | "custom";

interface DaySelectorProps {
  selectedDay: DayOption;
  customDate?: Date;
  onDayChange: (day: DayOption) => void;
  onCustomDateChange: (date: Date) => void;
  className?: string;
  variant?: "pills" | "tabs" | "cards";
  size?: "sm" | "md" | "lg";
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  customDate,
  onDayChange,
  onCustomDateChange,
  className = "",
  variant = "pills",
  size = "md",
}) => {
  const { t } = useTranslation();

  const dayOptions: { value: DayOption; label: string; icon?: string }[] = [
    { value: "yesterday", label: t("common.yesterday"), icon: "📅" },
    { value: "today", label: t("common.today"), icon: "📍" },
    { value: "tomorrow", label: t("common.tomorrow"), icon: "⏭️" },
    { value: "custom", label: t("common.customDate"), icon: "🗓️" },
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    onCustomDateChange(newDate);
    onDayChange("custom");
  };

  // Size classes
  const sizeClasses = {
    sm: {
      button: "px-3 py-1.5 text-sm",
      container: "gap-2",
      icon: "w-3 h-3",
    },
    md: {
      button: "px-4 py-2 text-sm",
      container: "gap-3",
      icon: "w-4 h-4",
    },
    lg: {
      button: "px-6 py-3 text-base",
      container: "gap-4",
      icon: "w-5 h-5",
    },
  };

  // Variant classes
  const getVariantClasses = (isSelected: boolean) => {
    const base = `${sizeClasses[size].button} font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`;

    switch (variant) {
      case "pills":
        return `${base} rounded-full ${
          isSelected
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`;

      case "tabs":
        return `${base} rounded-lg border-2 ${
          isSelected
            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md dark:bg-blue-900/20 dark:text-blue-400"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        }`;

      case "cards":
        return `${base} rounded-xl border shadow-sm ${
          isSelected
            ? "border-blue-500 bg-blue-500 text-white shadow-lg transform scale-105"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`;

      default:
        return base;
    }
  };

  return (
    <div className={`${className}`}>
      <div className={`flex flex-wrap ${sizeClasses[size].container}`}>
        {dayOptions.map((option) => {
          const isSelected = selectedDay === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onDayChange(option.value)}
              className={getVariantClasses(isSelected)}
              aria-pressed={isSelected}
              aria-label={`Select ${option.label}`}
            >
              <div className="flex items-center gap-2">
                {variant === "cards" && (
                  <span className="text-lg">{option.icon}</span>
                )}
                <span>{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Date Input */}
      {selectedDay === "custom" && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <div className="flex items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={customDate?.toISOString().split("T")[0] || ""}
                  onChange={handleDateChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                  placeholder="Select a date"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Custom date display */}
            {customDate && (
              <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Selected:{" "}
                  {customDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySelector;
