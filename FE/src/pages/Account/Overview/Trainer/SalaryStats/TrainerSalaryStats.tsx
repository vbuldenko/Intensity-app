import React from "react";
import { useTranslation } from "react-i18next";
import { getCurrentWage } from "../../../../../utils/trainings";
import { Training } from "../../../../../types/Training";

interface TrainerSalaryStatisticsProps {
  currentMonthTrainings: Training[];
  currentDayTrainings: Training[];
}

const TrainerSalaryStats: React.FC<TrainerSalaryStatisticsProps> = ({
  currentMonthTrainings,
  currentDayTrainings,
}) => {
  const { t } = useTranslation();

  return (
    <div className="trainer-overview__salary-section card-element ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="trainer-overview__title m-0">
          {t("trainerOverview.salary")}
        </h3>
        <div>
          <span className="text-green-500 text-xs border border-green-500 rounded-full px-2 py-0.5 ml-2">
            month
          </span>
          <span className="text-green-500 text-xs border border-green-500 rounded-full px-2 py-0.5 ml-2">
            group
          </span>
        </div>
      </div>
      <div className="trainer-overview__result">
        <p className="trainer-overview__label">
          {t("trainerOverview.currentTotal")}{" "}
        </p>
        <span className="trainer-overview__value text-teal-600">
          {getCurrentWage(currentMonthTrainings)} ₴
        </span>
      </div>
      <div className="trainer-overview__result">
        <p className="trainer-overview__label">{t("trainerOverview.today")} </p>
        <span className="trainer-overview__value text-teal-600">
          {getCurrentWage(currentDayTrainings)} ₴
        </span>
      </div>
      <div className="trainer-overview__result">
        <p className="trainer-overview__label">
          {t("trainerOverview.monthTrainings")}
        </p>
        <span className="trainer-overview__value">
          {currentMonthTrainings.length}
        </span>
      </div>
    </div>
  );
};

export default TrainerSalaryStats;
