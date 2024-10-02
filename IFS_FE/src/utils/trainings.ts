import { Training } from "../types/Training";

export function getSalaryPerTraining(visitors: number): number {
  return visitors <= 3 ? 300 : 300 + (visitors - 3) * 50;
}

export function getCurrentWage(trainings: Training[]): number {
  return trainings.reduce((totalSalary, { visitors }) => {
    return totalSalary + getSalaryPerTraining(visitors.length);
  }, 0);
}

export const filterByInstructor = (trainings, instructorId) => {
  return trainings.filter((training) => training.instructorId === instructorId);
};

export const filterByVisitors = (trainings, minVisitors) => {
  return trainings.filter(
    (training) => training.visitors.length >= minVisitors
  );
};

export const filterTrainingsByDate = (
  trainings,
  currentDate,
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

export function calculateHoursDiff(trainingTime) {
  const currentTime = new Date();
  return (trainingTime - currentTime) / (1000 * 60 * 60);
}

export const canTrainProceed = (trainingDate: string, trainingTime: string, visitorsCount: number): boolean => {
    const trainingDateTime = new Date(`${trainingDate}T${trainingTime}`);
    const currentDateTime = new Date();
    const timeDifferenceInHours = (trainingDateTime.getTime() - currentDateTime.getTime()) / (1000 * 60 * 60);

    if (timeDifferenceInHours < 3 && visitorsCount < 2) {
      return false; // Return training to user's subscription
    }
    return true;
  };

