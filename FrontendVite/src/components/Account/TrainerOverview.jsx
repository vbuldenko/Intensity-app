import { useSelector } from 'react-redux';
// import Abonements from './Abonements';

export default function TrainerOverview() {
    const currentDate = new Date();
    const user = useSelector(({ user }) => user);
    const trainings = useSelector(({ trainings }) => trainings);
    console.log(trainings);
    console.log(user);

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
                <div className="title trainer-results-title">Salary</div>
                <div className="trainer-results-element">
                    <p>Current total </p>
                    <span>₴ {trainerTrainings.length * 300}</span>
                </div>
                <div className="trainer-results-element">
                    <p>Today</p>
                    <span>₴ {trainerTrainings.length * 300}</span>
                </div>
                <div className="trainer-results-element">
                    <p>Number of trainings</p>
                    <span>{trainerTrainings.length}</span>
                </div>
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
