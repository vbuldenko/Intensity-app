import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notifyWith } from '../../../reducers/notificationReducer';
import { createAbonement } from '../../../reducers/abonementReducer';

function IndividualAbonement({ data, client }) {
    const user = useSelector(({ user }) => user);
    const dispatch = useDispatch();
    const [selectedAmountIndex, setSelectedAmountIndex] = useState(0);

    const selectedAbonement = data[selectedAmountIndex];

    const handleSubmit = async () => {
        // Think about admin adding abonements
        try {
            if (user.role === 'admin' && client) {
                await dispatch(createAbonement(selectedAbonement));
                dispatch(
                    notifyWith(
                        `Abonement for ${selectedAbonement.amount} trainings was purchased`
                    )
                );
            } else if (selectedAbonement) {
                await dispatch(createAbonement(selectedAbonement));
                dispatch(
                    notifyWith(
                        `Abonement for ${selectedAbonement.amount} trainings was purchased`
                    )
                );
            }
        } catch (error) {
            dispatch(notifyWith(error.response.data.error));
        }
    };

    const handleIncrement = () => {
        if (selectedAmountIndex < data.length - 1) {
            setSelectedAmountIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleDecrement = () => {
        if (selectedAmountIndex > 0) {
            setSelectedAmountIndex((prevIndex) => prevIndex - 1);
        }
    };

    return (
        <div className="abonement-container">
            <div className="amount-info l-text">
                <div className="amount-badge">{selectedAbonement.amount}</div>
                <div>TRAININGS</div>
            </div>
            <div className="align-center m-text">
                {selectedAbonement && (
                    <>
                        <p className="bold">
                            Price: {selectedAbonement.price} UAH
                        </p>
                        <p className="sx-font gray-clr">
                            1 training:{' '}
                            {Math.trunc(
                                selectedAbonement.price /
                                    selectedAbonement.amount
                            ) || null}{' '}
                            ₴
                        </p>
                    </>
                )}
            </div>
            <div className="button-group align-center">
                <button className="decrement-button" onClick={handleDecrement}>
                    -
                </button>
                <button className="increment-button" onClick={handleIncrement}>
                    +
                </button>
            </div>
            <button className="purchase-button" onClick={handleSubmit}>
                Buy
            </button>
        </div>
    );
}

export default function Purchases({ clientId }) {
    const notification = useSelector(({ notification }) => notification);
    const groupAbonements = [
        { amount: 1, price: 350 },
        { amount: 4, price: 1200 },
        { amount: 6, price: 1700 },
        { amount: 8, price: 2000 },
        { amount: 10, price: 2400 },
        { amount: 12, price: 2700 },
        // { amount: '∞', price: 4000 },
    ];
    const personalAbonements = [
        { amount: 1, price: 600 },
        { amount: 5, price: 2700 },
        { amount: 10, price: 5500 },
    ];
    const splitAbonements = [
        { amount: 1, price: 800 },
        { amount: 5, price: 3800 },
        { amount: 10, price: 7000 },
    ];
    // const kidsAbonements = [
    //     { amount: 1, price: 250 },
    //     { amount: 8, price: 1000 },
    //     { amount: 12, price: 1500 },
    // ];

    return (
        <div className="flex-column">
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
            <div className="f-wrap">
                <div className="flex-col">
                    <h2 className="l-text bold align-center">Group training</h2>
                    <IndividualAbonement
                        data={groupAbonements}
                        client={clientId ? clientId : null}
                    />
                </div>
                {/* <div className="flex-col">
                    <h2 className="l-text bold align-center">
                        Personal trainings
                    </h2>
                    <IndividualAbonement data={personalAbonements} />
                </div>
                <div className="flex-col" >
                    <h2 className="l-text bold align-center">
                        Split trainings
                    </h2>
                    <IndividualAbonement data={splitAbonements} />
                </div> */}
            </div>
        </div>
    );
}
