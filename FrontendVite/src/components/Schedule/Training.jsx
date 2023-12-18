import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTraining } from '../../reducers/trainingReducer';
import { updateAbonement } from '../../reducers/abonementReducer';
import {
    addReservation,
    removeReservation,
} from '../../reducers/reservationsReducer';
import { notifyWith } from '../../reducers/notificationReducer';
import '../styles/training.css';

export default function Training({ training }) {
    const notification = useSelector(({ notification }) => notification);
    const activeAbonement = useSelector(({ abonements }) =>
        abonements.find((abonement) => {
            const expirationDate = new Date(abonement.expiration_date);
            return abonement.expiration_date
                ? expirationDate >= new Date()
                : !abonement.expiration_date;
        })
    );
    const reservedTrainings = useSelector(
        ({ reservedTrainings }) => reservedTrainings
    );
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const isReserved = reservedTrainings.includes(training.id);
    const currentTime = new Date();
    const trainingTime = new Date(training.date);
    const threeHoursBeforeTraining = new Date(trainingTime);
    threeHoursBeforeTraining.setHours(trainingTime.getHours() - 3);

    // Combined handler for reservation and cancellation.
    const handleAction = async (updateType) => {
        if (currentTime >= threeHoursBeforeTraining) {
            setError(true);
            dispatch(
                notifyWith('Prohibited less than 3 hours before training.')
            );
            setTimeout(() => {
                setError(false);
            }, 3000);
            return;
        }

        // Think about indicating current status of reservation after page refresh
        if (updateType === 'reservation') {
            dispatch(addReservation(training.id));
        } else if (updateType === 'cancellation') {
            dispatch(removeReservation(training.id));
        }

        try {
            await dispatch(
                updateAbonement(activeAbonement.id, {
                    updateType,
                    trainingId: training.id,
                })
            );
            await dispatch(updateTraining(training.id, { updateType }));
        } catch (error) {
            console.log(error);
            setError(true);
            dispatch(
                notifyWith(
                    error.response ? error.response.data.error : 'error occured'
                )
            );
            setTimeout(() => {
                setError(false);
            }, 3000);
        }
    };

    return (
        <li className="scheduled-training ">
            {notification && error && (
                <div
                    style={{
                        color: 'red',
                        textAlign: 'center',
                        padding: '0.5em',
                    }}
                >
                    {notification}
                </div>
            )}
            <div className="scheduled-training-content">
                <div>
                    <b>{training.type.toUpperCase()}</b>
                    <p className="mt-0.5 font-bold">{training.time}</p>
                    <p>
                        Trainer: <b>{training.instructor.name}</b>
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: '0.5em',
                    }}
                >
                    <button
                        style={{
                            border: `1px solid ${isReserved ? 'red' : 'green'}`,
                            padding: '0.25em 1em',
                            borderRadius: '0.5em',
                            color: 'white',
                            background:
                                currentTime >= threeHoursBeforeTraining
                                    ? 'gray'
                                    : isReserved
                                    ? 'red'
                                    : 'green',
                            cursor:
                                currentTime >= threeHoursBeforeTraining
                                    ? 'not-allowed'
                                    : 'pointer',
                        }}
                        disabled={currentTime >= threeHoursBeforeTraining}
                        onClick={() =>
                            handleAction(
                                isReserved ? 'cancellation' : 'reservation'
                            )
                        }
                    >
                        {currentTime >= threeHoursBeforeTraining
                            ? 'Reservation closed'
                            : isReserved
                            ? 'Cancel'
                            : 'Reserve'}
                    </button>
                    <p>
                        Places left:{' '}
                        {training.maxCapacity -
                            training.registeredClients.length}
                    </p>
                </div>
            </div>
        </li>
    );
}
