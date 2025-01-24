import React, { useState } from "react";
import "./AdminOverview.scss";
import { studioStats } from "../../../../assets/mockData";
// import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../app/hooks";
import { selectAbonements } from "../../../../app/features/abonements/abonementSlice";

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const abonements = useAppSelector(selectAbonements);
  const [expenses, setExpenses] = useState(studioStats.expenses);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const currentMonthAbonements =
    abonements?.filter((abonement) => {
      const createdAt = new Date(abonement.createdAt);
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }) || [];

  // const totalIncome = abonements?.reduce((acc, a) => acc + a.price, 0);
  const currentMonthIncome = currentMonthAbonements.reduce(
    (acc, a) => acc + a.price,
    0
  );
  const dailyIncome = currentMonthIncome / daysInMonth;

  const totalExpenses = Object.values(expenses).reduce(
    (acc, expense) => acc + expense,
    0
  );
  const dailyProfit = dailyIncome - totalExpenses / daysInMonth;
  const monthlyProfit = currentMonthIncome - totalExpenses;

  const generalStats = {
    abonements: {
      totalAbonementsSold: abonements?.length || 0,
      abonementsSold: currentMonthAbonements?.length || 0,
      abonementDurationAnalysis: {
        one: currentMonthAbonements.filter(
          (abonement) => abonement.amount === 1
        ).length,
        four: currentMonthAbonements.filter(
          (abonement) => abonement.amount === 4
        ).length,
        six: currentMonthAbonements.filter(
          (abonement) => abonement.amount === 6
        ).length,
        eight: currentMonthAbonements.filter(
          (abonement) => abonement.amount === 8
        ).length,
        ten: currentMonthAbonements.filter(
          (abonement) => abonement.amount === 10
        ).length,
        twelve: currentMonthAbonements.filter(
          (abonement) => abonement.amount === 12
        ).length,
      },
      // abonementDurationAnalysis: {
      //   shortTerm: currentMonthAbonements.filter(
      //     (abonement) =>
      //       abonement.amount === 1 ||
      //       abonement.amount === 4 ||
      //       abonement.amount === 6
      //   ).length,
      //   midTerm: currentMonthAbonements.filter(
      //     (abonement) => abonement.amount === 8
      //   ).length,
      //   longTerm: currentMonthAbonements.filter(
      //     (abonement) => abonement.amount === 10 || abonement.amount === 12
      //   ).length,
      // },
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
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [name]: parseFloat(value),
    }));
  };

  const handleGeneratePDF = async () => {
    const { default: generatePDF } = await import(
      "../../../../utils/pdfGenerator"
    );
    if (abonements) {
      generatePDF(abonements);
    }
  };

  return (
    <div className="dashboard">
      <Statistics
        title={t("adminDashboard.generalStatistics")}
        stats={generalStats}
      />
      <ExpensesSection
        expenses={expenses}
        onExpenseChange={handleExpenseChange}
      />

      <button
        onClick={handleGeneratePDF}
        className="text-white bg-green-500 w-max py-1 px-4 my-4 rounded-full"
      >
        Generate PDF
      </button>
      {/* <TrainersSection trainers={data.topTrainersByAttendance} /> */}
    </div>
  );
};

const Statistics: React.FC<{
  title: string;
  stats: Record<string, any>;
}> = ({ title, stats }) => {
  const { t } = useTranslation();

  const renderNestedStats = (substats: Record<string, any>) => {
    return (
      <div className="flex flex-wrap justify-between gap-3 p-3">
        {Object.entries(substats).map(([subKey, subValue]) => (
          <div
            className="flex-1 flex gap-2 items-center min-w-15 border py-1 px-3 rounded-xl"
            key={subKey}
          >
            <p className="text-sm text-yellow-400">{subKey}:</p>

            <span className="">{subValue}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSubStats = (substats: Record<string, any>) => {
    return Object.entries(substats).map(([subKey, subValue]) => (
      <div className="statistics__item" key={subKey}>
        <p className="statistics__item-title">
          {t(`adminDashboard.${subKey}`)}:
        </p>

        {typeof subValue === "object" ? (
          renderNestedStats(subValue)
        ) : (
          <span className="statistics__item-value">{subValue}</span>
        )}
      </div>
    ));
  };

  const renderStats = (stats: Record<string, any>) => {
    return Object.entries(stats).map(([key, value]) => (
      <div className="statistics__section" key={key}>
        <p className="statistics__section-title  status-absolute">
          {t(`adminDashboard.${key}`)}:
        </p>
        <div className="statistics__section-content">
          {renderSubStats(value)}
        </div>
      </div>
    ));
  };

  return (
    <div className="statistics mb-4">
      <h3 className="statistics__title mb-4">{title}</h3>
      <div className="statistics__content">{renderStats(stats)}</div>
    </div>
  );
};

// const TrainersSection: React.FC<{ trainers: User[] }> = ({ trainers }) => (
//   <div className="admin-dashboard__section">
//     <h3 className="admin-dashboard__subtitle">Top Trainers by Attendance</h3>
//     <ul className="admin-dashboard__list card-element">
//       {trainers.map((trainer, i) => (
//         <li key={trainer.id} className="admin-dashboard__list-item">
//           <span>{trainer.firstName}:</span>
//           <p className={classNames({ "text-teal-500": i === 0 })}>
//             {/* {trainer.totalAttendees} attendees */}
//           </p>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

const ExpensesSection: React.FC<{
  expenses: Record<string, number>;
  onExpenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ expenses, onExpenseChange }) => {
  const { t } = useTranslation();

  return (
    <div className="statistics mb-4">
      <h3 className="statistics__title mb-4">{t("adminDashboard.expenses")}</h3>
      <div className="statistics__content">
        {Object.entries(expenses).map(([key, value]) => (
          <div className="dashboard__stat" key={key}>
            <p>{t(`adminDashboard.${key}`)}:</p>
            <span>
              <input
                type="number"
                name={key}
                value={value}
                onChange={onExpenseChange}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
