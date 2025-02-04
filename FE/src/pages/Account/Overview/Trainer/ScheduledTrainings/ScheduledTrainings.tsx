import { useTranslation } from "react-i18next";
import { UsersIcon } from "@heroicons/react/24/solid";
import TrainerTrainingCard from "../TrainerTrainingCard";
import { Training } from "../../../../../types/Training";

interface ScheduledTrainingsProps {
  title: string;
  trainings: Training[];
  sortOrder?: "asc" | "desc";
  counter?: boolean;
}

const ScheduledTrainings: React.FC<ScheduledTrainingsProps> = ({
  title,
  trainings,
  sortOrder = "asc",
  counter = true,
}) => {
  const { t } = useTranslation();

  // Sort trainings by date
  const sortedTrainings = [...trainings].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="trainer-overview__trainings-section card-element relative">
      {counter && (
        <div className="people-counter">
          <UsersIcon className="w-4" />
          {trainings.reduce((a, b) => a + b.reservations.length, 0)}
        </div>
      )}
      <h3 className="trainer-overview__title">{title}</h3>
      <div className="trainer-overview__trainings-list">
        {sortedTrainings.length > 0 ? (
          sortedTrainings.map((training) => (
            <TrainerTrainingCard key={training.id} training={training} />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            {t("trainerOverview.noTrainings")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScheduledTrainings;
