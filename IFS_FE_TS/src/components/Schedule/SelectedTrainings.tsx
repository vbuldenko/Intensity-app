import Training from "./Training";

export default function SelectedTrainings({ trainings }) {
  return (
    <section className="trainings">
      <ol className="trainings-list">
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
