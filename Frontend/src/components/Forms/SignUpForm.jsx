import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { notifyWith } from '../../reducers/notificationReducer';
import { createUser } from '../../reducers/userReducer';

const SignUpForm = () => {
    const defaultUserData = {
        username: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
        role: '',
    };

    const [signUpData, setSignUpData] = useState(defaultUserData);
    const navigate = useNavigate();
    const notification = useSelector(({ notification }) => notification);
    const dispatch = useDispatch();

    function handleChange(e) {
        const { name, value } = e.target;

        setSignUpData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(createUser(signUpData));
            setSignUpData(defaultUserData);
            navigate('/sign-in', { replace: true });
        } catch (error) {
            dispatch(notifyWith(error.response.data.error));
        }
    };

    return (
        <div className="form-wrapper card-el-bg ">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Create an account</h1>
                {notification && <h1>{notification}</h1>}
                <div>
                    <input
                        id="username"
                        type="text"
                        value={signUpData.username}
                        name="username"
                        placeholder="username"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="name"
                        type="text"
                        value={signUpData.name}
                        name="name"
                        placeholder="first name"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="surname"
                        type="text"
                        value={signUpData.surname}
                        name="surname"
                        placeholder="last name"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="email"
                        type="text"
                        value={signUpData.email}
                        name="email"
                        placeholder="email"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="phone"
                        type="text"
                        value={signUpData.phone}
                        name="phone"
                        placeholder="phone number"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        id="password"
                        type="password"
                        value={signUpData.password}
                        name="password"
                        placeholder="password"
                        onChange={handleChange}
                    />
                </div>
                <div className="role-input">
                    <label>Choose your role:</label>
                    <div className="flex-row">
                        <label className="label">
                            <input
                                type="radio"
                                name="role"
                                value="client"
                                checked={signUpData.role === 'client'}
                                onChange={handleChange}
                            />
                            <span>Client</span>
                        </label>
                        <label className="label">
                            <input
                                type="radio"
                                name="role"
                                value="trainer"
                                checked={signUpData.role === 'trainer'}
                                onChange={handleChange}
                            />
                            <span>Trainer</span>
                        </label>
                    </div>
                </div>
                <button id="login-button" type="submit" className="bold l-font">
                    Sign Up
                </button>
            </form>
            <div className="signup-subsection">
                <div>
                    <Link className="l-font" to="/sign-in">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
