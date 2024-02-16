import '../styles/form.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { notifyWith } from '../../reducers/notificationReducer';
import { forgotPassword } from '../../services/users';

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const notification = useSelector(({ notification }) => notification);

    const dispatch = useDispatch();
    const path = '/reset-password';

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const message = await forgotPassword(email);
            setEmail('');
            dispatch(notifyWith(message));
            setTimeout(() => navigate(path, { replace: true }), 5000); //path - to redirect to the page where user came from or default. replace - to delete sign in path from history stack
        } catch (error) {
            dispatch(notifyWith(error.response.data.error));
        }
    };

    return (
        <div className="form-wrapper card-el-bg ">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                {notification ? <h1>{notification}</h1> : null}
                <div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        name="email"
                        placeholder="Enter your account email"
                        onChange={({ target }) => setEmail(target.value)}
                    />
                </div>
                <button type="submit" className="bold l-font">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
