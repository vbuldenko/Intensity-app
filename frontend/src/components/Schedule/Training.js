import { useState } from 'react';

import { updateTraining } from '../../reducers/trainingReducer';
import { updateAbonement } from '../../reducers/abonementReducer';
import { notifyWith } from '../../reducers/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';
import abonement from '../../services/abonement';

export default function Training({ training }) {
    function getActiveAbonement(abonements) {
        const currentDate = new Date();
        const activeAbonement = abonements.filter((abonement) => {
            const expirationDate = new Date(abonement.expiration_date);
            return expirationDate >= currentDate;
        })[0];
        return activeAbonement;
    }
    const notification = useSelector(({ notification }) => notification);

    const { history, ...abRest } = useSelector(({ abonements }) =>
        getActiveAbonement(abonements)
    );

    const [reserved, setReserved] = useState(false);
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    // Combined handler for reservation and cancellation.
    const handleAction = async (updateType) => {
        const updatedAbonement = { ...abRest };
        console.log(updatedAbonement);
        console.log(updateType);

        if (updateType === 'reservation') {
            updatedAbonement.left = updatedAbonement.left - 1;
            updatedAbonement.history = [...history, training.id];
        } else if (updateType === 'cancellation') {
            updatedAbonement.left = updatedAbonement.left + 1;
            updatedAbonement.history = updatedAbonement.history.filter(
                (el) => el !== training.id
            );
        }
        console.log(updatedAbonement);

        try {
            await dispatch(
                updateAbonement(updatedAbonement.id, updatedAbonement)
            );
            await dispatch(
                updateTraining(training.id, {
                    updateType,
                    abonementId: updatedAbonement.id,
                })
            );
            setReserved((prev) => !prev);
        } catch (error) {
            console.log(error);
            setError(true);
            // dispatch(notifyWith(error.response.data.error));
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
                        border: `1px solid ${reserved ? 'red' : 'green'}`,
                        padding: '0.25em 1em',
                        borderRadius: '0.5em',
                    }}
                    onClick={() =>
                        handleAction(reserved ? 'cancellation' : 'reservation')
                    }
                >
                    {reserved ? 'Cancel' : 'Reserve'}
                </button>
                <p>
                    Places left:{' '}
                    {training.maxCapacity - training.registeredClients.length}
                </p>
            </div>
        </li>
    );
}
