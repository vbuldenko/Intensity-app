import '../styles/form.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { notifyWith } from '../../reducers/notificationReducer';
import { signUserIn } from '../../reducers/loginReducer';

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const notification = useSelector(({ notification }) => notification);

    const dispatch = useDispatch();
    const location = useLocation();
    const path = location.state?.from || '/account';

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await dispatch(signUserIn({ username, password }));
            setUsername('');
            setPassword('');
            navigate(path, { replace: true }); //path - to redirect to the page where user came from or default. replace - to delete sign in path from history stack
        } catch (error) {
            dispatch(notifyWith(error.response.data.error));
        }
    };

    return (
        <div className="form-wrapper card-el-bg ">
            <form className="auth-form" onSubmit={handleLogin}>
                <h1>Log in to application</h1>
                {notification ? <h1>{notification}</h1> : null}
                <div>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        name="Username"
                        placeholder="username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        name="Password"
                        placeholder="password"
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

                <button>Forgot password?</button>
            </div>
        </div>
    );
};

export default LoginForm;
