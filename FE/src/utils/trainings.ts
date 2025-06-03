import { ScheduleTraining } from "../types/Schedule";
import { Training } from "../types/Training";
import { isTomorrow } from "./utils";
import { WeekDays } from "../types/WeekDays";
import { SALARY } from "./constants";

export function getSalaryPerTraining(visitors: number): number {
  const minRate = SALARY.base;
  const additionalRate = SALARY.additional;
  return visitors <= 3 ? minRate : minRate + (visitors - 3) * additionalRate;
}
export function getSalaryForTop(visitors: number): number {
  return visitors * 175;
}

export function getCurrentWage(trainings: Training[], isTop = false): number {
  const calculator = isTop ? getSalaryForTop : getSalaryPerTraining;

  return trainings.reduce((totalSalary, { reservations }) => {
    return totalSalary + calculator(reservations.length);
  }, 0);
}

export const filterByInstructor = (
  trainings: Training[],
  instructorId: string
) => {
  return trainings.filter((training) => training.instructor === instructorId);
};

export const filterByVisitors = (
  trainings: Training[],
  minVisitorsAmount: number = 2
) => {
  return trainings.filter(
    (training) => training.reservations.length >= minVisitorsAmount
  );
};

export const filterTrainingsByDate = (
  trainings: Training[],
  date: Date,
  filterType: "month" | "day",
  upToCurrentMoment: boolean = false
) => {
  return trainings.filter((training) => {
    const trainingDate = new Date(training.date);
    const isSameYear = trainingDate.getFullYear() === date.getFullYear();
    const isSameMonth = trainingDate.getMonth() === date.getMonth();

    if (filterType === "month") {
      if (isSameYear && isSameMonth) {
        return upToCurrentMoment ? trainingDate <= date : true;
      }
    }

    if (filterType === "day") {
      const isSameDay = trainingDate.getDate() === date.getDate();
      if (isSameYear && isSameMonth && isSameDay) {
        return upToCurrentMoment
          ? trainingDate.getHours() >= date.getHours()
          : true;
      }
    }

    return false;
  });
};

export function calculateHoursDiff(
  currentTime: Date,
  trainingTime: Date
): number {
  const diffInMilliseconds = trainingTime.getTime() - currentTime.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}

export function reservationAccess(scheduledTime: Date, reservedPlaces: number) {
  const currentDateTime = new Date();
  const currentHour = currentDateTime.getHours();
  const hoursDiff = calculateHoursDiff(currentDateTime, scheduledTime);

  // Rule 1: If scheduled time has passed, reservation is closed
  if (currentDateTime >= scheduledTime) {
    return false;
  }

  // Rule 2: Client cannot reserve next day trainings scheduled at 9 a.m, 10 a.m, and 11 a.m after 9 p.m of the current day
  if (
    isTomorrow(scheduledTime) &&
    [9, 10, 11].includes(scheduledTime.getHours()) &&
    currentHour >= 21 &&
    reservedPlaces <= 1
  ) {
    return false;
  }

  if (
    currentDateTime.getDate() === scheduledTime.getDate() &&
    currentHour < 8 &&
    [9, 10, 11].includes(scheduledTime.getHours()) &&
    reservedPlaces <= 1
  ) {
    return false; // Not allowed to reserve morning trainings if there are less than two places reserved
  }

  // Rule 3: Client cannot reserve less than 3 hours before scheduled training
  if (hoursDiff <= 3) {
    if (reservedPlaces < 2) {
      return false; // Not allowed to reserve less than 3 hours before if there are less than two places reserved
    }
  }

  // If none of the above conditions are met, reservation is allowed
  return true;
}

export function groupTrainingsByDay(trainings: ScheduleTraining[]) {
  return Object.values(WeekDays).map((day) => ({
    day,
    trainings: trainings.filter((training) => training.day === day),
  }));
}
