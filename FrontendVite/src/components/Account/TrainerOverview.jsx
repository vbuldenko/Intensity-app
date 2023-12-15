import { useSelector } from 'react-redux';
// import Abonements from './Abonements';

export default function TrainerOverview() {
    const currentDate = new Date();
    const user = useSelector(({ user }) => user);
    const trainings = useSelector(({ trainings }) => trainings);

    const trainerTrainings = trainings
        .filter((training) => training.instructor.id === user.id)
        .filter(
            (training) =>
                new Date(training.date).getDate() <= currentDate.getDate()
        )
        .filter((training) => training.registeredClients.length >= 2);

    return (
        <div className="trainer-info">
            <div className="trainer-results">
                <p>Salary: ₴ {trainerTrainings.length * 300}</p>
                <p>Today salary: ₴ {trainerTrainings.length * 300}</p>
                <p>All trainings: {trainerTrainings.length}</p>
                <p>Today trainings: {trainerTrainings.length}</p>
            </div>
            <div className="today-trainings-list">
                <p className="trainer-info-header">Today's trainings</p>
                {trainerTrainings
                    .filter(
                        (training) =>
                            new Date(training.date).getDate() ===
                            currentDate.getDate()
                    )
                    .map((training) => (
                        <div
                            key={training.id}
                            className="trainer-history-element"
                        >
                            <p>
                                <span>date:</span> {training.date.slice(0, 10)}
                            </p>
                            <p>
                                <span>time:</span> {training.time}
                            </p>
                            <p>
                                <span>class:</span> {training.type}
                            </p>
                            <p>
                                <span>people:</span>{' '}
                                {training.registeredClients.length}
                            </p>
                        </div>
                    ))}
            </div>
            <div className="trainer-history">
                <p className="trainer-info-header">History</p>
                {trainerTrainings.map((training) => (
                    <div key={training.id} className="trainer-history-element">
                        <p>
                            <span>date:</span> {training.date.slice(0, 10)}
                        </p>
                        <p>
                            <span>time:</span> {training.time}
                        </p>
                        <p>
                            <span>class:</span> {training.type}
                        </p>
                        <p>
                            <span>people:</span>{' '}
                            {training.registeredClients.length}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
