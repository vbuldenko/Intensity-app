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
    <div className="trainer-overview__salary-section card-element">
      <h3 className="trainer-overview__title">{t("trainerOverview.salary")}</h3>

      <div className="trainer-overview__result">
        <p className="trainer-overview__label">
          {t("trainerOverview.currentTotal")}
        </p>
        <span className="trainer-overview__value text-teal-600">
          {getCurrentWage(currentMonthTrainings)} ₴
        </span>
      </div>
      <div className="trainer-overview__result">
        <p className="trainer-overview__label">{t("trainerOverview.today")}</p>
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
