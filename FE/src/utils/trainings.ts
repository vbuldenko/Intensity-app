import { ScheduleTraining } from "../types/Schedule";
import { Training } from "../types/Training";
import { isToday, isTomorrow } from "./utils";

export function getSalaryPerTraining(visitors: number): number {
  return visitors <= 3 ? 350 : 350 + (visitors - 3) * 50;
}

export function getCurrentWage(trainings: Training[]): number {
  return trainings.reduce((totalSalary, { reservations }) => {
    return totalSalary + getSalaryPerTraining(reservations.length);
  }, 0);
}

export const filterByInstructor = (
  trainings: Training[],
  instructorId: number
) => {
  return trainings.filter((training) => training.instructorId === instructorId);
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
  currentDate: Date,
  filterType: "month" | "day"
) => {
  return trainings.filter((training) => {
    const trainingDate = new Date(training.date);
    const isSameYear = trainingDate.getFullYear() === currentDate.getFullYear();
    const isSameMonth = trainingDate.getMonth() === currentDate.getMonth();

    if (filterType === "month") {
      return isSameYear && isSameMonth;
    }

    if (filterType === "day") {
      const isSameDay = trainingDate.getDate() === currentDate.getDate();
      return isSameYear && isSameMonth && isSameDay;
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

export function reservationAccess(
  currentDateTime: Date,
  scheduledTime: Date,
  reservedPlaces: number,
  hoursDiff: number
) {
  const currentHour = currentDateTime.getHours();
  // console.log("Is tomorrosW: ", isTomorrow(scheduledTime));

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

export function isCancellationForbidden(
  updateType: string,
  hoursDiff: number,
  currentTime: Date,
  trainingTime: Date
): boolean {
  const currentHour = currentTime.getHours();
  const isEarlyMorningTraining = [9, 10, 11].includes(trainingTime.getHours());
  const isLateReservationUpdate = currentHour >= 21 && isTomorrow(trainingTime);
  const isEarlyReservationUpdate = currentHour < 8 && isToday(trainingTime);

  return (
    updateType === "cancellation" &&
    (hoursDiff < 3 ||
      (isLateReservationUpdate && isEarlyMorningTraining) ||
      (isEarlyReservationUpdate && isEarlyMorningTraining))
  );
}

export function groupTrainingsByDay(trainings: ScheduleTraining[]) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return daysOfWeek.map((day) => ({
    day,
    trainings: trainings.filter((training) => training.day === day),
  }));
}

export const canTrainingProceed = (
  currentTime: Date,
  trainingDate: string,
  visitorsCount: number
): boolean => {
  const trainingDateTime = new Date(trainingDate);
  const timeDifference = calculateHoursDiff(currentTime, trainingDateTime);

  if (timeDifference < 3 && visitorsCount < 2) {
    return false;
  }
  return true;
};
