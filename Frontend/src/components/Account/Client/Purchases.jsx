import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notifyWith } from '../../../reducers/notificationReducer';
import { createAbonement } from '../../../reducers/abonementReducer';
import Selector from '../../Elements/Selector';

export default function Purchases({ clientId }) {
    const notification = useSelector(({ notification }) => notification);
    const abonementOptions = {
        group: [
            { amount: 1, price: 350 },
            { amount: 4, price: 1200 },
            { amount: 6, price: 1700 },
            { amount: 8, price: 2000 },
            { amount: 10, price: 2400 },
            { amount: 12, price: 2700 },
        ],
        personal: [
            { amount: 1, price: 600 },
            { amount: 5, price: 2700 },
            { amount: 10, price: 5500 },
        ],
        split: [
            { amount: 1, price: 800 },
            { amount: 5, price: 3800 },
            { amount: 10, price: 7000 },
        ],
        kids: [
            { amount: 1, price: 250 },
            { amount: 8, price: 1000 },
            { amount: 12, price: 1500 },
        ],
    };
    const user = useSelector(({ user }) => user);
    const dispatch = useDispatch();
    const [selectedType, setSelectedType] = useState('Group'); // Default selected type
    const [selectedAmountIndex, setSelectedAmountIndex] = useState(0);

    const selectedAbonementData =
        abonementOptions[selectedType.toLowerCase()] || [];
    const selectedAbonement = selectedAbonementData[selectedAmountIndex];

    const handleSubmit = async () => {
        try {
            if (user.role === 'admin' && clientId) {
                await dispatch(
                    createAbonement({
                        ...selectedAbonement,
                        type: selectedType,
                        clientId: clientId,
                    })
                );
                dispatch(
                    notifyWith(
                        `Abonement for ${selectedAbonement.amount} trainings was added`
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
        if (selectedAmountIndex < selectedAbonementData.length - 1) {
            setSelectedAmountIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleDecrement = () => {
        if (selectedAmountIndex > 0) {
            setSelectedAmountIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        setSelectedAmountIndex(0); // Reset selected amount index when type changes
    };

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

            <h2 className="l-text bold align-center">
                Оберіть тип занять та кількість тренувань
            </h2>

            <Selector
                selection={selectedType}
                handleSelection={handleTypeChange}
                buttonNames={['Group', 'Personal', 'Split', 'Kids']}
            />
            <div className="abonement-container card-el-bg">
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
                    <button
                        className="decrement-button"
                        onClick={handleDecrement}
                    >
                        -
                    </button>
                    <div className="amount-info l-text">
                        <div className="amount-badge">
                            {selectedAbonement?.amount}
                        </div>
                    </div>
                    <button
                        className="increment-button"
                        onClick={handleIncrement}
                    >
                        +
                    </button>
                </div>
                <button className="purchase-button" onClick={handleSubmit}>
                    {user.role === 'admin' && clientId
                        ? 'Додати абонемент'
                        : 'Перейти до оплати'}
                </button>
            </div>
        </div>
    );
}
