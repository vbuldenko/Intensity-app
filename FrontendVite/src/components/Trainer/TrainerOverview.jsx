import '../User/styles/useroverview.css';
import { useSelector } from 'react-redux';
// import Abonements from './Abonements';

export default function TrainerOverview() {
    const user = useSelector(({ user }) => user);
    if (!user) {
        return null;
    }

    const currentDate = new Date();

    const trainings = useSelector(({ trainings }) => trainings);

    const trainerTrainings = trainings
        .filter((training) => training.instructor.id === user.id)
        .filter(
            (training) =>
                new Date(training.date).getDate() <= currentDate.getDate()
        )
        .filter((training) => training.registeredClients.length >= 2);

    return (
        <div className="user-overview">
            <div className="user">
                {/* <img className="user-img" src={userData.img} /> */}
                <div>
                    <p className="user-name">
                        {user.name} {user.surname}
                    </p>
                    <span className="user-role">{user.role}</span>
                </div>
                <p className="user-date">
                    {currentDate.toString().slice(0, 16)}
                </p>
            </div>

            <div className="trainer-info">
                <p className="trainer-salary">
                    Salary: {trainerTrainings.length * 250}
                </p>
                <p className="training-number">
                    Number of trainings: {trainerTrainings.length}
                </p>
                <div className="trainer-history">
                    {trainerTrainings.map((training) => (
                        <div
                            key={training.id}
                            className="trainer-history-element"
                        >
                            <p>
                                <span>date:</span> {training.date}
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
                <div>
                    <p>Today's trainings</p>
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
                                    <span>date:</span> {training.date}
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
        </div>
    );
}
