import { useDispatch, useSelector } from 'react-redux';

import { notifyWith } from '../../../reducers/notificationReducer';
import { createAbonement } from '../../../reducers/abonementReducer';

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

    return (
        <div className="abonement-container">
            <div className="amount-info l-text">
                <div className="amount-badge">{amount}</div>
                <div>TRAININGS</div>
            </div>
            <div className="align-center m-text">
                <p>Price: ${price}</p>
                <p>1 training: ${calculatePricePerTraining()}</p>
            </div>
            <button className="purchase-button" onClick={handleSubmit}>
                Buy
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
        <div className="flex-column">
            <h2 className="l-text bold align-center">Choose your Abonement</h2>
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
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '2.5rem',
                }}
            >
                {abonementData.map(({ amount, price }) => (
                    <IndividualAbonement amount={amount} price={price} />
                ))}
            </div>
        </div>
    );
}
