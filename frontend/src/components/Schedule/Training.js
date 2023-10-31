import { useState } from 'react';
import { updateTraining } from '../../reducers/trainingReducer';
import {
    addReservation,
    removeReservation,
} from '../../reducers/reservationsReducer';
import { notifyWith } from '../../reducers/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';

export default function Training({ training }) {
    const notification = useSelector(({ notification }) => notification);
    const activeAbonement = useSelector(({ abonements }) =>
        abonements.find((abonement) => {
            const expirationDate = new Date(abonement.expiration_date);
            return expirationDate >= new Date();
        })
    );
    const reservedTrainings = useSelector(
        ({ reservedTrainings }) => reservedTrainings
    );
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const isReserved = reservedTrainings.includes(training.id);

    // Combined handler for reservation and cancellation.
    const handleAction = async (updateType) => {
        const currentTime = new Date();
        const trainingTime = new Date(training.date);
        const threeHoursBeforeTraining = new Date(trainingTime);
        threeHoursBeforeTraining.setHours(trainingTime.getHours() - 3);

        if (
            (updateType === 'reservation' &&
                currentTime >= threeHoursBeforeTraining) ||
            (updateType === 'cancellation' &&
                currentTime >= threeHoursBeforeTraining)
        ) {
            console.log(
                "You can't reserve or cancel a training less than 3 hours before it starts."
            );
            return;
        }

        if (updateType === 'reservation') {
            dispatch(addReservation(training.id));
        } else if (updateType === 'cancellation') {
            dispatch(removeReservation(training.id));
        }

        try {
            await dispatch(
                updateTraining(training.id, {
                    updateType,
                    abonementId: activeAbonement.id,
                })
            );
        } catch (error) {
            console.log(error);
            setError(true);
            dispatch(notifyWith(error.response.data.error));
            setTimeout(() => {
                setError(false);
            }, 3000);
        }
    };

    return (
        <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
            {notification && error && (
                <div
                    style={{
                        color: 'red',
                        border: '1px solid red',
                        padding: '1em',
                        borderRadius: '1em',
                    }}
                >
                    {notification}
                </div>
            )}
            <div className="flex-auto items-center">
                <b className="text-gray-900">
                    {training.time}
                    {' - '}
                    {training.type}
                </b>
                <p className="mt-0.5">Duration: 50 min</p>
                <p className="text-gray-900">
                    Trainer: <b>{training.instructor}</b>
                </p>
            </div>

            <div
                style={{
                    display: 'flex',
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
                        background: `${isReserved ? 'red' : 'green'}`,
                    }}
                    onClick={() =>
                        handleAction(
                            isReserved ? 'cancellation' : 'reservation'
                        )
                    }
                >
                    {isReserved ? 'Cancel' : 'Reserve'}
                </button>
                <p>
                    Places left:{' '}
                    {training.maxCapacity - training.registeredClients.length}
                </p>
            </div>
        </li>
    );
}
