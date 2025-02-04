import { useTranslation } from "react-i18next";
import { UsersIcon } from "@heroicons/react/24/solid";
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
    <div className="trainer-overview__salary-section card-element flex flex-col gap-2">
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
        <div className="flex items-center">
          <span className="trainer-overview__value mr-2">
            {currentMonthTrainings.length}
          </span>

          <div className="border border-green-500 rounded-full px-2 py-1.5 flex items-center gap-1">
            <span className="bg-green-100 bg-opacity-200 text-green-500 text-xs rounded-full px-3 py-0.5">
              today {currentDayTrainings.length}
            </span>
            <span className="bg-green-100 bg-opacity-200 text-green-500 text-xs rounded-full px-3 py-0.5 flex items-center gap-1">
              <UsersIcon className="w-4" />
              {currentDayTrainings.reduce(
                (acc, el) => acc + el.reservations.length,
                0
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSalaryStats;
