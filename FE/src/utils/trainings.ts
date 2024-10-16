import { Training } from "../types/Training";

export function getSalaryPerTraining(visitors: number): number {
  return visitors <= 3 ? 300 : 300 + (visitors - 3) * 50;
}

export function getCurrentWage(trainings: Training[]): number {
  return trainings.reduce((totalSalary, { visitors }) => {
    return totalSalary + getSalaryPerTraining(visitors.length);
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
  minVisitors: number
) => {
  return trainings.filter(
    (training) => training.visitors.length >= minVisitors
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
  return diffInMilliseconds / (1000 * 60 * 60);
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
