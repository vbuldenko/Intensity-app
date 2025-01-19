import React from "react";
import { useTranslation } from "react-i18next";
import TrainerTrainingCard from "../TrainerTrainingCard";
import { Training } from "../../../../../types/Training";

interface ScheduledTrainingsProps {
  title: string;
  trainings: Training[];
}

const ScheduledTrainings: React.FC<ScheduledTrainingsProps> = ({
  title,
  trainings,
}) => {
  const { t } = useTranslation();

  return (
    <div className="trainer-overview__trainings-section card-element">
      <h3 className="trainer-overview__title">{title}</h3>
      <div className="trainer-overview__trainings-list">
        {trainings.length > 0 ? (
          trainings.map((training) => (
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
