import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './loginform.css';

import { notifyWith } from '../reducers/notificationReducer';
import { signUserIn } from '../reducers/userReducer';

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            dispatch(signUserIn({ username, password }));
            setUsername('');
            setPassword('');
            navigate('/');
        } catch (exception) {
            dispatch(notifyWith({ text: 'Wrong credentials', error: true }));
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <h1>Log in to application</h1>
            <div>
                username
                <input
                    id="username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    id="password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button id="login-button" type="submit">
                login
            </button>
        </form>
    );
};

export default LoginForm;
