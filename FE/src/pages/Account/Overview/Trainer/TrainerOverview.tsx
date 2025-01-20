import {
  filterByVisitors,
  filterTrainingsByDate,
} from "../../../../utils/trainings";
import "./TrainerOverview.scss";
import { User } from "../../../../types/User";
import { useTranslation } from "react-i18next";
import TrainerTrainingHistoryCard from "./TrainerTrainingHistoryCard";
import TrainerSalaryStats from "./SalaryStats";
import ScheduledTrainings from "./ScheduledTrainings";
import ScrollToTopButton from "../../../../components/Elements/ScrollToTopBtn/ScrollToTopButton";

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
    "month",
    true
  );
  const currentDayTrainings = filterTrainingsByDate(
    trainerTrainings,
    currentDate,
    "day"
  );

  const todayLeftTrainings = filterTrainingsByDate(
    currentDayTrainings,
    currentDate,
    "day",
    true
  );

  // Calculate tomorrow's date
  const tomorrowDate = new Date();
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const tomorrowTrainings = filterTrainingsByDate(
    trainerTrainings,
    tomorrowDate,
    "day"
  );

  return (
    <div className="trainer-overview">
      <TrainerSalaryStats
        currentMonthTrainings={currentMonthTrainings}
        currentDayTrainings={currentDayTrainings}
      />
      <ScheduledTrainings
        title={t("trainerOverview.todayTrainings")}
        trainings={todayLeftTrainings}
      />
      <ScheduledTrainings
        title={t("trainerOverview.tomorrowTrainings")}
        trainings={tomorrowTrainings}
      />

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
      <ScrollToTopButton />
    </div>
  );
};

export default TrainerOverview;
