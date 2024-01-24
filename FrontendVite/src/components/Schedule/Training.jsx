import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTraining } from '../../reducers/trainingReducer';
import { updateAbonement } from '../../reducers/abonementReducer';
import {
    addReservation,
    removeReservation,
} from '../../reducers/reservationsReducer';
import { notifyWith } from '../../reducers/notificationReducer';

export default function Training({ training }) {
    const notification = useSelector(({ notification }) => notification);

    const activeAbonement = useSelector(({ abonements }) =>
        abonements.find((abonement) => {
            // -----------------------------------------------------look for active or not activated abonement
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
        if (!activeAbonement) {
            setError(true);
            dispatch(notifyWith('No abonement, buy one to proceed!'));
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
                <div className="flex-row-container st-title top-zero left-zero">
                    <p>{training.time}</p>
                    <p className="bold">{training.type.toUpperCase()}</p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        paddingTop: '1rem',
                    }}
                    // className="red"
                >
                    <p className="status">
                        Trainer: <b>{training.instructor.name}</b>
                    </p>
                    <p className="m-text">
                        Places left:{' '}
                        {training.maxCapacity -
                            training.registeredClients.length}
                    </p>
                    <button
                        style={{
                            padding: '0.25em 1em',
                            borderRadius: '0.5em',
                            color: 'white',
                            background:
                                currentTime >= threeHoursBeforeTraining
                                    ? 'var(--gray-color-4)'
                                    : isReserved
                                    ? 'var(--red-color)'
                                    : 'var(--green-color)',
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
                            ? 'Closed'
                            : isReserved
                            ? 'Cancel'
                            : 'Reserve'}
                    </button>
                </div>
            </div>
        </li>
    );
}
