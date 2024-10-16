import { Training as TrainingType } from "../../../types/Training";
import Training from "../Training";
import "./SelectedDayTrainings.scss";

export default function SelectedDayTrainings({
  trainings,
}: {
  trainings: TrainingType[];
}) {
  return (
    <section className="schedule__trainings trainings">
      <ul className="trainings__list">
        {trainings.length > 0 ? (
          trainings.map((training) => (
            <Training key={training.id} training={training} />
          ))
        ) : (
          <p>No trainings for today.</p>
        )}
      </ul>
    </section>
  );
}
