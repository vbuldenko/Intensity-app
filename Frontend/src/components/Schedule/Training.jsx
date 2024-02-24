import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTraining } from '../../reducers/trainingReducer';
import { updateAbonement } from '../../reducers/abonementReducer';
import reservationAccess from '../../utils';
import { isTomorrow } from '../../utils';
import { notifyWith } from '../../reducers/notificationReducer';

export default function Training({ training, activeAbonement }) {
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const notification = useSelector(({ notification }) => notification);

    const isReserved = activeAbonement
        ? activeAbonement.history.some(
              (hTraining) => hTraining.id === training.id
          )
        : false;

    const currentTime = new Date();
    const trainingTime = new Date(training.date);
    const reservedPlaces = training.registeredClients.length;
    const hoursDiff = (trainingTime - currentTime) / (1000 * 60 * 60);
    const currentHour = currentTime.getHours();

    const access = reservationAccess(
        currentTime,
        trainingTime,
        reservedPlaces,
        hoursDiff
    );

    const handleNotification = (message) => {
        setError(true);
        dispatch(notifyWith(message));
        setTimeout(() => {
            setError(false);
        }, 3000);
    };

    const handleAction = async (updateType) => {
        const cancellationForbidden =
            updateType === 'cancellation' &&
            (hoursDiff < 3 ||
                (isTomorrow(currentTime, trainingTime) &&
                    [9, 10, 11].includes(trainingTime.getHours()) &&
                    currentHour >= 21) ||
                ([9, 10, 11].includes(trainingTime.getHours()) &&
                    currentHour < 8));

        if (!activeAbonement) {
            handleNotification('No abonement, buy one to proceed!');
            return;
        }
        if (updateType === 'reservation' && activeAbonement.left === 0) {
            handleNotification('No trainings left, buy a new abonement!');
            return;
        }
        if (cancellationForbidden) {
            handleNotification(
                'You cannot cancel morning trainings scheduled for tomorrow after 9p.m or any training 3 hours before its begining!'
            );
            return;
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
            handleNotification(
                error.response ? error.response.data.error : 'error occurred'
            );
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
                <div className="flex-row-container title2 top-zero left-zero">
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
                >
                    <p className="status">
                        Trainer: <b>{training.instructor.name}</b>
                    </p>
                    <p className="m-text">
                        Places left: {training.maxCapacity - reservedPlaces}
                    </p>
                    <button
                        style={{
                            width: '100px',
                            padding: '0.3rem',
                            borderRadius: '0.5rem',
                            color: 'white',
                            background: !access
                                ? 'var(--gray-color-4)'
                                : isReserved
                                ? 'var(--red-color)'
                                : 'var(--green-color)',
                            cursor: access ? 'pointer' : 'not-allowed',
                        }}
                        disabled={!access}
                        onClick={() =>
                            handleAction(
                                isReserved ? 'cancellation' : 'reservation'
                            )
                        }
                    >
                        {!access ? 'Closed' : isReserved ? 'Cancel' : 'Reserve'}
                    </button>
                </div>
            </div>
        </li>
    );
}
