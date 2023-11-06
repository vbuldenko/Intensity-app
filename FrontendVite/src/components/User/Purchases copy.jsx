import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { notifyWith } from '../../reducers/notificationReducer';
import { createAbonement } from '../../reducers/abonementReducer';

export default function Purchases() {
    const [abonementData, setAbonementData] = useState({
        amount: 4,
    });

    const calculatePrice = (amount) => {
        if (amount === 4) return 1300;
        if (amount === 6) return 1800;
        if (amount === 8) return 2200;
        if (amount === 10) return 2500;
        if (amount === 12) return 2700;
    };

    const getPricePerTraining = (price, amount) => {
        return price / amount;
    };

    function handleSubmit(e) {
        e.preventDefault();
        console.log(abonementData);
    }

    function handleChange(e) {
        const { name, type, value, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : parseInt(value, 10);

        setAbonementData(() => ({
            [name]: newValue,
        }));
    }

    const dispatch = useDispatch();

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     try {
    //         dispatch(createAbonement(abonementData));
    //         setAbonementData({amount: 4,
    //         activation: false })
    //     } catch (exception) {
    //         dispatch(notifyWith({ text: 'Error occured', error: true }));
    //     }
    // };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    };

    const formStyle = {
        width: '300px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'white',
    };

    const rangeStyle = {
        fontSize: '1rem',
        margin: '8px 0',
    };

    // const checkboxStyle = {
    //     fontSize: '1rem',
    //     margin: '8px 0',
    //     display: 'block',
    // };

    const priceStyle = {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '8px',
    };

    const perTrainingPriceStyle = {
        fontSize: '1rem',
        marginBottom: '8px',
    };

    const buttonStyle = {
        fontSize: '1rem',
        padding: '10px',
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const totalPrice = calculatePrice(abonementData.amount);
    const perTrainingPrice = getPricePerTraining(
        totalPrice,
        abonementData.amount
    );

    return (
        <div style={containerStyle}>
            <form
                style={formStyle}
                className="abon-purchase-form"
                onSubmit={handleSubmit}
            >
                <h1>Choose your abonement</h1>
                <div>
                    <input
                        type="range"
                        min={4}
                        max={12}
                        step={2}
                        value={abonementData.amount}
                        name="amount"
                        onChange={handleChange}
                        style={rangeStyle}
                    />
                    <p>Number of Trainings: {abonementData.amount}</p>
                    <p style={priceStyle}>Price: ₴{totalPrice}</p>
                    <p style={perTrainingPriceStyle}>
                        Price per 1 Training: ₴{perTrainingPrice}
                    </p>
                </div>
                {/* <div style={{ display: 'flex' }}>
                    <input
                        id="activation"
                        type="checkbox"
                        checked={abonementData.activation}
                        name="activation"
                        onChange={handleChange}
                        style={checkboxStyle}
                    />
                    <label htmlFor="activation"> Activate</label>
                </div> */}
                <button type="submit" style={buttonStyle}>
                    Purchase
                </button>
            </form>
        </div>
    );
}
