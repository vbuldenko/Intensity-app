import { useDispatch, useSelector } from 'react-redux';

import { notifyWith } from '../../reducers/notificationReducer';
import { createAbonement } from '../../reducers/abonementReducer';

function IndividualAbonement({ amount, price }) {
    const dispatch = useDispatch();
    const calculatePricePerTraining = () => price / amount;

    const handleSubmit = async () => {
        try {
            dispatch(createAbonement({ amount, price }));
            dispatch(
                notifyWith(`Abonement for ${amount} trainings was purchased`)
            );
        } catch (error) {
            dispatch(notifyWith(error.response.data.error));
        }
    };

    const abonementStyle = {
        borderRadius: '1em',
        padding: '1em',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5em',
        minWidth: '250px',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        background: 'rgba(250, 250, 250, 0.1)',
    };

    const buttonStyle = {
        backgroundColor: 'rgba(0, 173, 23, 0.6)',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '2em',
        cursor: 'pointer',
        marginTop: '0.5em',
        width: '100%',
    };

    return (
        <div style={abonementStyle}>
            <h3 style={{ fontSize: '1.25rem' }}>{amount} trainings</h3>
            <p>Price: ${price}</p>
            <p>1 training: ${calculatePricePerTraining()}</p>
            <button style={buttonStyle} onClick={handleSubmit}>
                Purchase
            </button>
        </div>
    );
}

export default function Purchases() {
    const notification = useSelector(({ notification }) => notification);
    const abonementData = [
        { amount: 4, price: 1300 },
        { amount: 6, price: 1800 },
        { amount: 8, price: 2200 },
        { amount: 10, price: 2500 },
        { amount: 12, price: 2700 },
    ];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1em' }}>
                Choose your Abonement
            </h2>
            {notification && (
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

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                    gap: '1em',
                }}
            >
                {abonementData.map(({ amount, price }) => (
                    <div
                        key={amount}
                        style={{
                            flex: '1',
                            maxWidth: '300px',
                        }}
                    >
                        <IndividualAbonement amount={amount} price={price} />
                    </div>
                ))}
            </div>
        </div>
    );
}
