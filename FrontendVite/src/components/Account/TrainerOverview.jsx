import { useSelector } from 'react-redux';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import HistoryElement from '../Elements/HistoryElement';

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
                            <div key={training.id} className="training-element">
                                <p>{training.time}</p>
                                <CheckCircleIcon className="h-6 w-6 check-icon" />
                                <div className="training-card">
                                    <div>
                                        <p className="section-title">
                                            {training.type}
                                        </p>
                                        <span className="gray-status">
                                            Group Class
                                        </span>
                                    </div>
                                    <div>
                                        <p className="visitors">
                                            Visitors:{' '}
                                            {training.registeredClients.length}
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
    );
}
