import {
    useParams,
    useOutletContext,
    Link,
    useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Trainer() {
    const { id } = useParams();
    const location = useLocation();
    const trainer = useSelector(({ users }) =>
        users.find((user) => user.id === id.toString())
    );

    const trainings = useSelector(({ trainings }) => trainings);

    if (!trainer) {
        return null;
    }
    const trainerTrainings = trainings
        .filter((training) => training.instructor.surname === trainer.surname)
        .filter((training) => new Date(training.date) <= new Date())
        .filter((training) => training.registeredClients.length >= 2);

    console.log(trainerTrainings);

    const search = location.state?.search || '';

    return (
        <div>
            <Link to={`..${search}`} relative="path" className="back-button">
                &larr; <span>Back to all trainers</span>
            </Link>
            <div className="trainer-info">
                <p className="trainer-name">
                    {trainer.name} {trainer.surname}
                </p>
                <p className="trainer-phone">{trainer.phone}</p>
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
            </div>
        </div>
    );
}
