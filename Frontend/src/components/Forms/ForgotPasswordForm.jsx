import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { notifyWith } from '../../reducers/notificationReducer';
import usersService from '../../services/users';

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState(null);
    // const notification = useSelector(({ notification }) => notification);

    const dispatch = useDispatch();
    // const path = '/reset-password';

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { message } = await usersService.forgotPassword(email);
            setEmail('');
            // dispatch(notifyWith(message));
            setNotification(message);

            // setTimeout(() => navigate(path, { replace: true }), 5000); //path - to redirect to the page where user came from or default. replace - to delete sign in path from history stack
        } catch (error) {
            // dispatch(notifyWith(error.response.data.error));
            setNotification(error.response.data.error || 'error occured');
        }
    };

    return (
        <div className="form-wrapper card-el-bg ">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                {notification ? (
                    <p className="green-clr s-font">{notification}</p>
                ) : null}
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
