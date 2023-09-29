import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import './styles/loginform.css';

import { notifyWith } from '../reducers/notificationReducer';
import { signUserIn } from '../reducers/userReducer';

const LoginForm = () => {
    const [signUpData, setSignUpData] = useState({
        username: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        console.log(signUpData);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setSignUpData((prev) => ({
            ...prev,
            [name]: value,
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
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Log in to application</h1>
                <div>
                    <input
                        id="username"
                        type="text"
                        value={signUpData.username}
                        name="Username"
                        placeholder="username"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="name"
                        type="text"
                        value={signUpData.name}
                        name="Name"
                        placeholder="first name"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="surname"
                        type="text"
                        value={signUpData.surname}
                        name="Surname"
                        placeholder="last name"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="email"
                        type="text"
                        value={signUpData.email}
                        name="Email"
                        placeholder="email"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="phone"
                        type="text"
                        value={signUpData.phone}
                        name="Phone"
                        placeholder="phone number"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="password"
                        type="password"
                        value={signUpData.password}
                        name="Password"
                        placeholder="password"
                        onChange={handleChange}
                    />
                </div>
                <button id="login-button" type="submit">
                    Sign Up
                </button>
            </form>
            <div className="signup-subsection">
                <div>
                    <Link className="logo" to="/sign-in">
                        Log In
                    </Link>
                </div>
                <div>
                    <button>Forgot password?</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
