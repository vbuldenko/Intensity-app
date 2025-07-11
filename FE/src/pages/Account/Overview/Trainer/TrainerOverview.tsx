import {
  filterByVisitors,
  filterTrainingsByDate,
} from "../../../../utils/trainings";
import "./TrainerOverview.scss";
import { User } from "../../../../types/User";
import { useTranslation } from "react-i18next";
import TrainerSalaryStats from "./SalaryStats";
import ScheduledTrainings from "./ScheduledTrainings";
import ScrollToTopButton from "../../../../components/Buttons/ScrollToTopButton/ScrollToTopButton";
// import Selector from "../../../../components/Elements/Selector";

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

  return (
    <div className="trainer-overview">
      <TrainerSalaryStats
        currentMonthTrainings={currentMonthTrainings}
        currentDayTrainings={currentDayTrainings}
        isTop={user.email === "amanzhelam@gmail.com"}
      />
      <ScheduledTrainings
        className="p-4"
        trainings={trainerTrainings}
        title={t("trainerOverview.trainingList")}
        initialDay="today"
        showCounter={true}
        showDaySelector={true}
      />

      {/* <div className="trainer-overview__trainings-section card-element">
        <h3 className="trainer-overview__title">
          {t("trainerOverview.history")}
        </h3> */}
      {/* <Selector
          selection={abonementView}
          handleSelection={handleViewChange}
          buttonNames={buttonNames}
        /> */}
      {/* <div className="trainer-overview__trainings-list">
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
      </div> */}
      <ScrollToTopButton />
    </div>
  );
};

export default TrainerOverview;
