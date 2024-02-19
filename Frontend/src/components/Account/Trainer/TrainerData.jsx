import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import HistoryElement from '../../Elements/HistoryElement';

const TrainerData = ({ user }) => {
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
        <div className="trainer-overview">
            <div className="results-section card-el-bg ">
                <div className="title top-zero align-left">Salary</div>

                <div className="result-el">
                    <p className="s-font">Current total (₴)</p>
                    <span className="bold green-clr">
                        {' '}
                        {trainerTrainings.length * 300}
                    </span>
                </div>
                <div className="result-el">
                    <p className="s-font">Today (₴)</p>
                    <span className="bold green-clr">
                        {trainerTrainings.length * 300}
                    </span>
                </div>
                <div className="result-el">
                    <p className="s-font">Number of trainings</p>
                    <span className="bold green-clr">
                        {trainerTrainings.length}
                    </span>
                </div>
            </div>
            <div className="trainings-section card-el-bg">
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
                                <div className="training-card acc-card-el-bg2">
                                    <div>
                                        <p className="section-title">
                                            {training.type}
                                        </p>
                                        <span className="status4 xs-font">
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
            <div className="history-section card-el-bg">
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
};

export default TrainerData;
