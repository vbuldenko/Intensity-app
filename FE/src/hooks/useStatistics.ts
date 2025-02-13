import { useMemo } from "react";
import { useAppSelector } from "../app/hooks";
import { selectAbonements } from "../app/features/abonements/abonementSlice";
import { selectTrainings } from "../app/features/trainings/trainingSlice";
import { Training } from "../types/Training";
import { Abonement } from "../types/Abonement";

interface AggregatedTraining {
  name: string;
  attendance: number;
}

const aggregateTrainingsByAttendance = (
  trainings: Training[],
  getKey: (training: Training) => string
): AggregatedTraining[] => {
  const trainingMap = new Map<string, AggregatedTraining>();

  trainings.forEach((training) => {
    const key = getKey(training);
    if (!trainingMap.has(key)) {
      trainingMap.set(key, {
        name: key,
        attendance: training.reservations.length,
      });
    } else {
      const existingTraining = trainingMap.get(key)!;
      existingTraining.attendance += training.reservations.length;
    }
  });

  return Array.from(trainingMap.values()).sort(
    (a, b) => b.attendance - a.attendance
  );
};

const getTopTrainingsByAttendance = (
  trainings: Training[],
  topN: number = 4
) => {
  const aggregatedTrainings = aggregateTrainingsByAttendance(
    trainings,
    (training) => `${training.type} - ${training.time}`
  );

  return aggregatedTrainings.slice(0, topN).reduce(
    (acc, training) => {
      acc[training.name] = training.attendance;
      return acc;
    },
    {} as Record<string, number>
  );
};

const getCurrentMonthTrainings = (
  trainings: Training[],
  currentMonth: number,
  currentYear: number
) => {
  return trainings.filter((training) => {
    const trainingDate = new Date(training.date);
    return (
      trainingDate.getMonth() === currentMonth &&
      trainingDate.getFullYear() === currentYear
    );
  });
};

const getCurrentMonthAbonements = (
  abonements: any[],
  currentMonth: number,
  currentYear: number
) => {
  return abonements.filter((abonement) => {
    const createdAt = new Date(abonement.createdAt);
    return (
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear
    );
  });
};

const calculateIncome = (abonements: any[]) => {
  return abonements.reduce((acc, abonement) => acc + abonement.price, 0);
};

const calculateAbonementDurationAnalysis = (abonements: any[]) => {
  return {
    one: abonements.filter((abonement) => abonement.amount === 1).length,
    four: abonements.filter((abonement) => abonement.amount === 4).length,
    six: abonements.filter((abonement) => abonement.amount === 6).length,
    eight: abonements.filter((abonement) => abonement.amount === 8).length,
    ten: abonements.filter((abonement) => abonement.amount === 10).length,
    twelve: abonements.filter((abonement) => abonement.amount === 12).length,
  };
};
const calculateAbonementFormatAnalysis = (abonements: Abonement[]) => {
  return {
    group: abonements.filter((abonement) => abonement.type === "group").length,
    personal: abonements.filter((abonement) => abonement.type === "personal")
      .length,
    // split: abonements.filter((abonement) => abonement.type === "split").length,
  };
};

const calculateAbonementStatusAnalysis = (abonements: any[]) => {
  return {
    active: abonements.filter((abonement) => abonement.status === "active")
      .length,
    "near-term": abonements.filter(
      (abonement) =>
        abonement.left > 0 &&
        abonement.left <= 2 &&
        abonement.status === "active"
    ).length,
    ended: abonements.filter(
      (abonement) =>
        (abonement.status === "expired" || abonement.status === "ended") &&
        new Date(abonement.updatedAt).getMonth() === new Date().getMonth()
    ).length,
    inactive: abonements.filter((abonement) => abonement.status === "inactive")
      .length,
  };
};

export const useStatistics = (expenses: Record<string, number>) => {
  const data = useAppSelector(selectAbonements);
  const { data: trainings } = useAppSelector(selectTrainings);
  const abonements = data || [];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const currentMonthTrainings = useMemo(
    () => getCurrentMonthTrainings(trainings, currentMonth, currentYear),
    [trainings]
  );
  const currentMonthAbonements = useMemo(
    () => getCurrentMonthAbonements(abonements, currentMonth, currentYear),
    [abonements, currentMonth, currentYear]
  );

  const currentMonthIncome = useMemo(
    () => calculateIncome(currentMonthAbonements),
    [currentMonthAbonements]
  );
  const dailyIncome = currentMonthIncome / daysInMonth;

  const totalExpenses = useMemo(
    () => Object.values(expenses).reduce((acc, expense) => acc + expense, 0),
    [expenses]
  );
  const dailyProfit = dailyIncome - totalExpenses / daysInMonth;
  const monthlyProfit = currentMonthIncome - totalExpenses;

  const topTrainings = useMemo(
    () => getTopTrainingsByAttendance(currentMonthTrainings),
    [currentMonthTrainings]
  );

  const generalStats = useMemo(
    () => ({
      trainings: {
        topTrainings,
      },
      abonements: {
        totalAbonementsSold: abonements?.length || 0,
        abonementsSold: currentMonthAbonements?.length || 0,
        abonementDurationAnalysis: calculateAbonementDurationAnalysis(
          currentMonthAbonements
        ),
        abonementFormatAnalysis: calculateAbonementFormatAnalysis(
          currentMonthAbonements
        ),
        abonementStatusAnalysis: calculateAbonementStatusAnalysis(abonements),
      },
      income: {
        monthlyIncome: currentMonthIncome.toFixed(1),
        dailyIncome: dailyIncome.toFixed(1),
        cardIncome: currentMonthAbonements
          .filter((abonement) => abonement.paymentMethod === "card")
          .reduce((sum, abonement) => sum + abonement.price, 0),
        cashIncome: currentMonthAbonements
          .filter((abonement) => abonement.paymentMethod === "cash")
          .reduce((sum, abonement) => sum + abonement.price, 0),
      },
      profit: {
        monthlyProfit: monthlyProfit.toFixed(1),
        dailyProfit: dailyProfit.toFixed(1),
      },
    }),
    [
      abonements,
      currentMonthAbonements,
      currentMonthIncome,
      dailyIncome,
      monthlyProfit,
      dailyProfit,
    ]
  );

  return { abonements, generalStats };
};
