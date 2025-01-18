import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { Training } from "../../../../../types/Training";

// interface Reservation {
//   id: string;
//   user: {
//     firstName: string;
//     lastName: string;
//   };
// }

// interface Training {
//   id: string;
//   time: string;
//   type: string;
//   reservations: Reservation[];
// }

interface TrainingCardProps {
  training: Training;
}

const TrainerTrainingCard: React.FC<TrainingCardProps> = ({ training }) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default TrainerTrainingCard;
