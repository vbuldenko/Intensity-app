import { Training } from "../types/Training";

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

export function calculateHoursDiff(trainingTime: Date): number {
  const currentTime = new Date();
  const diffInMilliseconds = trainingTime.getTime() - currentTime.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}

export const canTrainingProceed = (
  trainingDate: string,
  visitorsCount: number
): boolean => {
  const trainingDateTime = new Date(trainingDate);
  const timeDifference = calculateHoursDiff(trainingDateTime);

  if (timeDifference < 3 && visitorsCount < 2) {
    return false;
  }
  return true;
};
