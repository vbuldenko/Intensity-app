import {
    useParams,
    useOutletContext,
    Link,
    useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import HistoryElement from '../../Elements/HistoryElement';

export default function Trainer() {
    const currentDate = new Date();
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
        <div className="flex-column-container">
            <Link to={`..${search}`} relative="path" className="back-button">
                &larr; <span>Back to all trainers</span>
            </Link>

            <div className="trainer-overview">
                <div className="results-section">
                    <div className="section-title">Salary</div>
                    <div className="content-wrapper flex-row-container">
                        <div className="result-el">
                            <p>Current total (₴)</p>
                            <span> {trainerTrainings.length * 300}</span>
                        </div>
                        <div className="result-el">
                            <p>Today (₴)</p>
                            <span>{trainerTrainings.length * 300}</span>
                        </div>
                        <div className="result-el">
                            <p>Number of trainings</p>
                            <span>{trainerTrainings.length}</span>
                        </div>
                    </div>
                </div>
                <div className="trainings-section">
                    <div className="title top-zero">Today trainings</div>
                    <div className="trainings-section-list">
                        {trainerTrainings
                            .filter(
                                (training) =>
                                    new Date(training.date).getDate() ===
                                    currentDate.getDate()
                            )
                            .map((training) => (
                                <div
                                    key={training.id}
                                    className="training-element"
                                >
                                    <p>{training.time}</p>
                                    <CheckCircleIcon className="h-6 w-6 check-icon" />
                                    <div className="training-card">
                                        <div>
                                            <p className="training-type">
                                                {training.type}
                                            </p>
                                            <span className="gray-status">
                                                Group Class
                                            </span>
                                        </div>
                                        <div>
                                            <p className="xs-font">
                                                Visitors:{' '}
                                                {
                                                    training.registeredClients
                                                        .length
                                                }
                                            </p>
                                            <div></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="history-section">
                    <div className="title top-zero">History</div>
                    <div className="history">
                        {trainerTrainings.map((training) => (
                            <HistoryElement
                                key={training.id}
                                data={training}
                                trainer={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
