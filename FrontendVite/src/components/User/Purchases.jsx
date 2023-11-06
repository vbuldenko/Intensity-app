import { useDispatch, useSelector } from 'react-redux';

import { notifyWith } from '../../reducers/notificationReducer';
import { createAbonement } from '../../reducers/abonementReducer';

function IndividualAbonement({ amount, price }) {
    const dispatch = useDispatch();
    const calculatePricePerTraining = () => price / amount;

    const handleSubmit = async () => {
        const abonementData = { amount };
        try {
            dispatch(createAbonement({ amount }));
            dispatch(
                notifyWith(`Abonement for ${amount} trainings was purchased`)
            );
        } catch (error) {
            dispatch(notifyWith(error.response.data.error));
        }
    };

    const abonementStyle = {
        borderRadius: '8px',
        padding: '1em',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
    };

    const buttonStyle = {
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    };

    return (
        <div style={abonementStyle}>
            <h2>Abonement for {amount} Trainings</h2>
            <p>Price: ${price}</p>
            <p>Price per 1 Training: ${calculatePricePerTraining()}</p>
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
            <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
                Choose your Abonement
            </h1>
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
