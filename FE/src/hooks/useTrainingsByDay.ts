import { useMemo } from "react";
import { Training } from "../types/Training";
import { filterTrainingsByDate } from "../utils/trainings";

export type DayOption = "today" | "tomorrow" | "yesterday" | "custom";

interface UseTrainingsByDayProps {
  trainings: Training[];
  selectedDay: DayOption;
  customDate?: Date;
  sortOrder?: "asc" | "desc";
}

export const useTrainingsByDay = ({
  trainings,
  selectedDay,
  customDate,
  sortOrder = "asc",
}: UseTrainingsByDayProps) => {
  const filteredAndSortedTrainings = useMemo(() => {
    let targetDate: Date;

    switch (selectedDay) {
      case "today":
        targetDate = new Date();
        break;
      case "tomorrow":
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1);
        break;
      case "yesterday":
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 1);
        break;
      case "custom":
        targetDate = customDate || new Date();
        break;
      default:
        targetDate = new Date();
    }

    // Filter trainings by the target date
    const filtered = filterTrainingsByDate(
      trainings,
      targetDate,
      "day",
      selectedDay === "today"
    );

    // Sort trainings by time
    return filtered.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });
  }, [trainings, selectedDay, customDate, sortOrder]);

  const totalReservations = useMemo(
    () =>
      filteredAndSortedTrainings.reduce(
        (total, training) => total + (training.reservations?.length || 0),
        0
      ),
    [filteredAndSortedTrainings]
  );

  return {
    trainings: filteredAndSortedTrainings,
    totalReservations,
    isEmpty: filteredAndSortedTrainings.length === 0,
  };
};
