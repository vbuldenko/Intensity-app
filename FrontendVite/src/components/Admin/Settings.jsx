import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logUserOut } from '../../reducers/loginReducer';
import { deleteUser } from '../../reducers/usersReducer';
import storageService from '../../services/storage';

function Settings() {
    const user = storageService.loadUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = () => {
        dispatch(logUserOut());
        navigate('/sign-in'); //Maybe there no need for this?
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteUser(user.id));
            dispatch(logUserOut());
            console.log('account was successfully deleted!');
            navigate('/sign-in', { replace: true });
        } catch (error) {
            console.log(error);
        }

        navigate('/sign-in'); //Maybe there no need for this?
    };
    return (
        <div>
            <div>
                Log yourself out of the application:{' '}
                <button
                    style={{
                        background: 'green',
                        padding: '0.5em 1em',
                        borderRadius: '0.5em',
                        color: 'white',
                    }}
                    onClick={handleLogOut}
                >
                    Log Out
                </button>
            </div>
            <div>
                Delete your account:{' '}
                <button
                    style={{
                        background: 'red',
                        padding: '0.5em 1em',
                        borderRadius: '0.5em',
                        color: 'white',
                    }}
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default Settings;
