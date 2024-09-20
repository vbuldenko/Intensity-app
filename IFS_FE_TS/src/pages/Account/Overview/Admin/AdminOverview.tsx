import React from "react";
import "./AdminOverview.scss";
import { studioStats } from "../../../../assets/mockData";

interface AttendanceRate {
  trainingId: number;
  trainingName: string;
  totalSpots: number;
  attendees: number;
  attendancePercentage: number;
}

interface Trainer {
  trainerId: number;
  trainerName: string;
  totalAttendees: number;
}

interface Client {
  clientId: number;
  clientName: string;
  abonementsPurchased: number;
}

interface TrainingStats {
  totalTrainingsHeld: number;
  totalAbonementsSold: number;
  revenueFromAbonements: number;
  attendanceRate: AttendanceRate[];
  topTrainersByAttendance: Trainer[];
  topClientsByAbonements: Client[];
  expenses: {
    rent: number;
    utilities: number;
    taxes: number;
    wages: number;
  };
  income: {
    daily: number;
    monthly: number;
  };
  profit: {
    daily: number;
    monthly: number;
  };
}

// interface Props {
//   data: TrainingStats;
// }

const AdminDashboard: React.FC = () => {
  const data = studioStats;
  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Current Perfomance</h1>

      <div className="admin-dashboard__section">
        <h2 className="admin-dashboard__subtitle">General Statistics</h2>
        <div className="admin-dashboard__content">
          <div className="admin-dashboard__stat">
            <p>Total Trainings Held:</p>
            <span>{data.totalTrainingsHeld}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Total Abonements Sold:</p>
            <span>{data.totalAbonementsSold}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Total Revenue:</p>
            <span>${data.revenueFromAbonements}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Daily Income:</p>
            <span>${data.income.daily}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Monthly Income:</p>
            <span>${data.income.monthly}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Daily Profit:</p>
            <span>${data.profit.daily.toFixed(2)}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Monthly Profit:</p>
            <span>${data.profit.monthly.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard__section">
        <h2 className="admin-dashboard__subtitle">
          Top Trainers by Attendance
        </h2>
        <ul className="admin-dashboard__list card-element">
          {data.topTrainersByAttendance.map((trainer) => (
            <li key={trainer.trainerId} className="admin-dashboard__list-item">
              <span>{trainer.trainerName}:</span> {trainer.totalAttendees}{" "}
              attendees
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-dashboard__section">
        <h2 className="admin-dashboard__subtitle">Expenses</h2>
        <div className="admin-dashboard__content">
          <div className="admin-dashboard__stat">
            <p>Rent:</p>
            <span>${data.expenses.rent}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Utilities:</p>
            <span>${data.expenses.utilities}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Taxes:</p>
            <span>${data.expenses.taxes}</span>
          </div>
          <div className="admin-dashboard__stat">
            <p>Wages:</p>
            <span>${data.expenses.wages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
