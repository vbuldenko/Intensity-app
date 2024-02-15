import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTraining } from '../../reducers/trainingReducer';
import { updateAbonement } from '../../reducers/abonementReducer';
import reservationAccess from '../../utils';
import { findMostRecentAbonement, isTomorrow } from '../../utils';
// import {
//     addReservation,
//     removeReservation,
// } from '../../reducers/reservationsReducer';
import { notifyWith } from '../../reducers/notificationReducer';

export default function Training({ training }) {
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const notification = useSelector(({ notification }) => notification);

    //either active-ended or non-active
    const activeAbonement = useSelector(({ abonements }) =>
        findMostRecentAbonement(abonements)
    );

    const isReserved = activeAbonement
        ? activeAbonement.history.some(
              (hTraining) => hTraining.id === training.id
          )
        : false;

    const currentTime = new Date();
    const trainingTime = new Date(training.date);
    const reservedPlaces = training.registeredClients.length;
    const hoursDiff = (trainingTime - currentTime) / (1000 * 60 * 60); // Calculating hours difference
    const currentHour = currentTime.getHours();

    const access = reservationAccess(
        currentTime,
        trainingTime,
        reservedPlaces,
        hoursDiff
    );

    // Combined handler for reservation and cancellation.
    const handleAction = async (updateType) => {
        if (!activeAbonement) {
            setError(true);
            dispatch(notifyWith('No abonement, buy one to proceed!'));
            setTimeout(() => {
                setError(false);
            }, 3000);
            return;
        }
        if (updateType === 'reservation' && activeAbonement.left === 0) {
            setError(true);
            dispatch(notifyWith('No trainings left, buy a new abonement!'));
            setTimeout(() => {
                setError(false);
            }, 3000);
            return;
        }
        // if there are already two places reserved and less than three hours before training cancellation forbidden
        if (
            (updateType === 'cancellation' && hoursDiff < 3) ||
            (updateType === 'cancellation' &&
                isTomorrow(currentTime, trainingTime) &&
                [9, 10, 11].includes(trainingTime.getHours()) &&
                currentHour >= 21)
        ) {
            setError(true);
            dispatch(notifyWith('You cannot cancel 3 hours before training!'));
            setTimeout(() => {
                setError(false);
            }, 3000);
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
