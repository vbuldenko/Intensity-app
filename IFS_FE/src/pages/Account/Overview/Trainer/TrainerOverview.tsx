import { useAppSelector } from "../../../../app/hooks";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
// import HistoryElement from "../../../../components/Elements/HistoryElement";
import { selectTrainings } from "../../../../features/trainings/trainingSlice";
import {
  filterByInstructor,
  filterByVisitors,
  filterTrainingsByDate,
  getCurrentWage,
} from "../../../../utils/trainings";
import "./TrainerOverview.scss";

const TrainerOverview = ({ user }) => {
  const currentDate = new Date();
  const trainings = useAppSelector(selectTrainings);

  const trainerTrainings = filterByVisitors(
    filterByInstructor(trainings, user.id),
    2
  );
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
        <div className="trainer-overview__title">Salary</div>

        <div className="trainer-overview__result ">
          <p className="trainer-overview__label">Current total</p>
          <span className="trainer-overview__value text-teal-600">
            {getCurrentWage(currentMonthTrainings)} ₴
          </span>
        </div>
        <div className="trainer-overview__result">
          <p className="trainer-overview__label">Today</p>
          <span className="trainer-overview__value text-teal-600">
            {getCurrentWage(currentDayTrainings)} ₴
          </span>
        </div>
        <div className="trainer-overview__result">
          <p className="trainer-overview__label">Month trainings</p>
          <span className="trainer-overview__value">
            {currentMonthTrainings.length}
          </span>
        </div>
      </div>

      <div className="trainer-overview__trainings-section card-element">
        <div className="trainer-overview__title">Today Trainings</div>
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
                    Visitors: {training.visitors.length}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerOverview;