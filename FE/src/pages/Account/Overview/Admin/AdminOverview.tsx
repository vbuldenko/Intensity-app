import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { studioStats } from "../../../../assets/mockData";
import "./AdminOverview.scss";
import { useStatistics } from "../../../../hooks/useStatistics";

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState(studioStats.expenses);
  const { abonements, generalStats } = useStatistics(expenses);

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
      <div className="statistics__subitem">
        {Object.entries(substats).map(([subKey, subValue]) => (
          <div className="statistics__subitem-element" key={subKey}>
            <p className="text-sm text-yellow-400">{subKey}:</p>

            <span className="min-w-max">{subValue}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSubStats = (substats: Record<string, any>) => {
    return Object.entries(substats).map(([subKey, subValue]) => (
      <div
        className={classNames("statistics__item", {
          "col-span-2":
            subKey === "abonementDurationAnalysis" ||
            subKey === "abonementFormatAnalysis" ||
            subKey === "abonementStatusAnalysis" ||
            subKey === "topTrainings",
        })}
        key={subKey}
      >
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
