import { useMemo } from "react";
import { useAppSelector } from "../app/hooks";
import { selectAbonements } from "../app/features/abonements/abonementSlice";

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

const calculateAbonementStatusAnalysis = (abonements: any[]) => {
  return {
    active: abonements.filter((abonement) => abonement.status === "active")
      .length,
    nearTerm: abonements.filter(
      (abonement) =>
        abonement.left > 0 &&
        abonement.left <= 2 &&
        abonement.status === "active"
    ).length,
    ended: abonements.filter(
      (abonement) =>
        abonement.status === "expired" || abonement.status === "ended"
    ).length,
    inactive: abonements.filter((abonement) => abonement.status === "inactive")
      .length,
  };
};

export const useStatistics = (expenses: Record<string, number>) => {
  const data = useAppSelector(selectAbonements);
  const abonements = data || [];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

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

  const generalStats = useMemo(
    () => ({
      abonements: {
        totalAbonementsSold: abonements?.length || 0,
        abonementsSold: currentMonthAbonements?.length || 0,
        abonementDurationAnalysis: calculateAbonementDurationAnalysis(
          currentMonthAbonements
        ),
        abonementStatusAnalysis: calculateAbonementStatusAnalysis(
          currentMonthAbonements
        ),
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
