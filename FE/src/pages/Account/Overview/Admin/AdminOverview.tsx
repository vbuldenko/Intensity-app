import React, { useEffect, useState } from "react";
import "./AdminOverview.scss";
import { studioStats } from "../../../../assets/mockData";
// import classNames from "classnames";
import { abonementService } from "../../../../services/abonementService";
import { Abonement } from "../../../../types/Abonement";
import { useTranslation } from "react-i18next";
// import { User } from "../../../../types/User";

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [abonements, setAbonements] = useState<Abonement[]>([]);
  const data = studioStats;
  const [expenses, setExpenses] = useState(data.expenses);

  useEffect(() => {
    abonementService.getAll().then(setAbonements);
  }, []);

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
    abonementsSold: currentMonthAbonements?.length || 0,
    // totalIncome: totalIncome.toFixed(1),
    dailyIncome: dailyIncome.toFixed(1),
    monthlyIncome: currentMonthIncome.toFixed(1),
    dailyProfit: dailyProfit.toFixed(1),
    monthlyProfit: monthlyProfit.toFixed(1),
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [name]: parseFloat(value),
    }));
  };

  return (
    <div className="admin-dashboard">
      <StatisticsSection
        title={t("adminDashboard.generalStatistics")}
        stats={generalStats}
      />
      <ExpensesSection
        expenses={expenses}
        onExpenseChange={handleExpenseChange}
      />
      {/* <TrainersSection trainers={data.topTrainersByAttendance} /> */}
    </div>
  );
};

const StatisticsSection: React.FC<{
  title: string;
  stats: Record<string, string | number>;
}> = ({ title, stats }) => {
  const { t } = useTranslation();

  return (
    <div className="admin-dashboard__section">
      <h3 className="admin-dashboard__subtitle">{title}</h3>
      <div className="admin-dashboard__content">
        {Object.entries(stats).map(([key, value]) => (
          <div className="admin-dashboard__stat" key={key}>
            <p>{t(`adminDashboard.${key}`)}:</p>
            <span>
              {key !== "abonementsSold" && (
                <b className="mr-1 text-xs text-violet-400">₴</b>
              )}
              {value}
            </span>
          </div>
        ))}
      </div>
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
    <div className="admin-dashboard__section">
      <h3 className="admin-dashboard__subtitle">
        {t("adminDashboard.expenses")}
      </h3>
      <div className="admin-dashboard__content">
        {Object.entries(expenses).map(([key, value]) => (
          <div className="admin-dashboard__stat" key={key}>
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
