import Training from "../Training";
import "./SelectedDayTrainings.scss";

export default function SelectedDayTrainings({ trainings }) {
  return (
    <section className="trainings">
      <ol className="trainings__list">
        {trainings.length > 0 ? (
          trainings.map((training) => (
            <Training key={training.id} training={training} />
          ))
        ) : (
          <p>No trainings for today.</p>
        )}
      </ol>
    </section>
  );
}
