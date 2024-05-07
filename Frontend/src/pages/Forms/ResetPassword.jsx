import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { notifyWith } from '../../reducers/notificationReducer';
import usersService from '../../services/users';

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const notification = useSelector(({ notification }) => notification);

    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await usersService.resetPassword({
                newPassword: password,
                token: resetToken,
            });
            setPassword('');
            dispatch(notifyWith(response.message));
            setTimeout(() => navigate('/sign-in', { replace: true }), 5000); //path - to redirect to the page where user came from or default. replace - to delete sign in path from history stack
        } catch (error) {
            dispatch(notifyWith(error.response.data.error));
        }
    };

    return (
        <div className="form-wrapper card-el-bg ">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                {notification ? (
                    <p className="green-clr s-font">{notification}</p>
                ) : null}
                <div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        name="password"
                        placeholder="Enter new password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit" className="bold l-font">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
