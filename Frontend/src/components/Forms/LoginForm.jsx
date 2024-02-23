import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { notifyWith } from '../../reducers/notificationReducer';
import { signUserIn } from '../../reducers/loginReducer';

const LoginForm = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const notification = useSelector(({ notification }) => notification);
    const dispatch = useDispatch();
    const location = useLocation();
    const path = location.state?.from || '/account';

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await dispatch(signUserIn({ identifier, password }));
            setIdentifier('');
            setPassword('');
            navigate(path, { replace: true });
        } catch (error) {
            dispatch(
                notifyWith(error.response?.data?.error ?? 'An error occurred')
            );
        }
    };

    return (
        <div className="form-wrapper card-el-bg">
            <form className="auth-form" onSubmit={handleLogin}>
                <h1>Log in to application</h1>
                {notification && <h1>{notification}</h1>}
                <div>
                    <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        name="identifier"
                        placeholder="Email or Phone Number"
                        onChange={({ target }) => setIdentifier(target.value)}
                    />
                </div>
                <div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        name="password"
                        placeholder="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit" className="bold l-font">
                    Log In
                </button>
            </form>
            <div className="signup-subsection">
                <div>
                    <p>New here?</p>
                    <Link className="l-font" to="/sign-up">
                        Sign Up
                    </Link>
                </div>
                <Link to="/forgot-password">Forgot password?</Link>
            </div>
        </div>
    );
};

export default LoginForm;
