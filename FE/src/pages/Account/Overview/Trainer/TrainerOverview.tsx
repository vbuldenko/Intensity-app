import {
  filterByVisitors,
  filterTrainingsByDate,
  getCurrentWage,
} from "../../../../utils/trainings";
import "./TrainerOverview.scss";
import { User } from "../../../../types/User";
import { useTranslation } from "react-i18next";
import TrainerTrainingCard from "./TrainerTrainingCard";
import TrainerTrainingHistoryCard from "./TrainerTrainingHistoryCard";

interface TrainerOverviewProps {
  user: User;
}

const TrainerOverview: React.FC<TrainerOverviewProps> = ({ user }) => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const trainerTrainings = filterByVisitors(user.trainings);

  const currentMonthTrainings = filterTrainingsByDate(
    trainerTrainings,
    currentDate,
    "month"
  );
  const currentDayTrainings = filterTrainingsByDate(
    trainerTrainings,
    currentDate,
    "day"
  );

  return (
    <div className="trainer-overview">
      <div className="trainer-overview__salary-section card-element">
        <h3 className="trainer-overview__title">
          {t("trainerOverview.salary")}
        </h3>

        <div className="trainer-overview__result">
          <p className="trainer-overview__label">
            {t("trainerOverview.currentTotal")}
          </p>
          <span className="trainer-overview__value text-teal-600">
            {getCurrentWage(currentMonthTrainings)} ₴
          </span>
        </div>
        <div className="trainer-overview__result">
          <p className="trainer-overview__label">
            {t("trainerOverview.today")}
          </p>
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

      <div className="trainer-overview__trainings-section card-element">
        <h3 className="trainer-overview__title">
          {t("trainerOverview.todayTrainings")}
        </h3>
        <div className="trainer-overview__trainings-list">
          {currentDayTrainings.length > 0 ? (
            currentDayTrainings.map((training) => (
              <TrainerTrainingCard key={training.id} training={training} />
            ))
          ) : (
            <p className="text-gray-500 text-center">
              {t("trainerOverview.noTrainings")}
            </p>
          )}
        </div>
      </div>

      <div className="trainer-overview__trainings-section card-element">
        <h3 className="trainer-overview__title">
          {t("trainerOverview.history")}
        </h3>
        <div className="trainer-overview__trainings-list">
          {currentMonthTrainings.length > 0 ? (
            currentMonthTrainings.map((el) => (
              <TrainerTrainingHistoryCard key={el.id} training={el} />
            ))
          ) : (
            <p className="text-gray-300 text-center">
              {t("trainerOverview.noHistory")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerOverview;
