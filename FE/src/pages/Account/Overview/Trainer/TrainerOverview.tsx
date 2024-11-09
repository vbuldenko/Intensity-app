import { CheckCircleIcon } from "@heroicons/react/24/outline";
// import HistoryElement from "../../../../components/Elements/HistoryElement";
import {
  filterByVisitors,
  filterTrainingsByDate,
  getCurrentWage,
} from "../../../../utils/trainings";
import "./TrainerOverview.scss";
import { User } from "../../../../types/User";
import { useTranslation } from "react-i18next";

interface TrainerOverviewProps {
  user: User;
}

const TrainerOverview: React.FC<TrainerOverviewProps> = ({ user }) => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const trainerTrainings = filterByVisitors(user.trainings, 2);

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
          {currentDayTrainings.map((training) => (
            <div key={training.id} className="training">
              <p className="training__time">{training.time}</p>
              <CheckCircleIcon className="training__check-icon" />
              <div className="training__card">
                <div>
                  <p className="training__type">{training.type}</p>
                </div>
                <div>
                  <p className="training__visitors">
                    {t("history.visitors")}: {training.visitors.length}
                  </p>
                </div>
              </div>
            </div>
          )).length > 0 || (
            <p className="text-gray-500 text-center">
              {t("trainerOverview.noTrainings")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerOverview;
