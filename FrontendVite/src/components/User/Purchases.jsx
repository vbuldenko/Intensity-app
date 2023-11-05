import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { notifyWith } from '../../reducers/notificationReducer';
import { createAbonement } from '../../reducers/abonementReducer';

export default function Purchases() {
    const [abonementData, setAbonementData] = useState({
        amount: 4,
        activation: false,
    });

    function handleSubmit(e) {
        e.preventDefault();
        console.log(abonementData);
    }

    function handleChange(e) {
        const { name, type, value, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setAbonementData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    }

    const dispatch = useDispatch();

    // const handleLogin = async (event) => {
    //     event.preventDefault();
    //     try {
    //         dispatch(signUserIn({ username, password }));
    //         setUsername('');
    //         setPassword('');
    //         navigate('/');
    //     } catch (exception) {
    //         dispatch(notifyWith({ text: 'Wrong credentials', error: true }));
    //     }
    // };

    return (
        <div className="login-wrapper">
            <form className="abon-purchase-form" onSubmit={handleSubmit}>
                <h1>Choose your abonement</h1>
                <div>
                    <input
                        id="amount"
                        type="number"
                        value={abonementData.amount}
                        name="amount"
                        placeholder="amount"
                        onChange={handleChange}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <input
                        id="activation"
                        type="checkbox"
                        checked={abonementData.activation}
                        name="activation"
                        onChange={handleChange}
                        style={{ display: 'block' }}
                    />
                    <label htmlFor="activation"> Activate</label>
                </div>
                <button id="purchase-button" type="submit">
                    Purchase
                </button>
            </form>
        </div>
    );
}
