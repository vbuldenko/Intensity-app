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
import HistoryElement from "../../../../components/Elements/HistoryElement";

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
              <div key={training.id} className="training">
                <div className="flex gap-2 items-center">
                  <p className="training__time">{training.time}</p>
                  <CheckCircleIcon className="training__check-icon" />
                </div>
                <div className="training__card">
                  <div className="flex">
                    <p className="training__type">{training.type}</p>
                  </div>
                  <div className="flex text-sm text-gray-500">
                    <p>
                      {t("history.visitors")}: {training.reservations.length}
                    </p>
                  </div>
                </div>

                <div className="training__visitors">
                  {training.reservations.length > 0
                    ? training.reservations.map((el) => (
                        <span key={el.id}>
                          {`${el.user.firstName} ${el.user.lastName}`}
                        </span>
                      ))
                    : null}
                </div>
              </div>
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
              <HistoryElement key={el.id} data={el} trainer={false} />
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
