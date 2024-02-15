import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logUserOut } from '../../reducers/loginReducer';
import { deleteUser } from '../../reducers/usersReducer';
import storageService from '../../services/storage';

import {
    PhoneIcon,
    AtSymbolIcon,
    KeyIcon,
    IdentificationIcon,
    PencilSquareIcon,
    UserMinusIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

function Settings() {
    const user = storageService.loadUser();
    const { name, email, phone } = useSelector(({ user }) => user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = () => {
        storageService.removeUser();
        dispatch({ type: 'RESET_STATE' });
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
        <div className="settings">
            <div className="profile">
                <h1>Personal information</h1>
                <div className="personal-info">
                    <div className="personal-info-el">
                        <div>
                            <IdentificationIcon className="h-6 w-6" />
                            <p className="s-font">Name</p>
                            <p className="red">{name}</p>
                        </div>

                        <button>
                            <PencilSquareIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="personal-info-el">
                        <div>
                            <AtSymbolIcon className="h-6 w-6" />
                            <p className="s-font">Email</p>
                            <p>{email}</p>
                        </div>
                        <button>
                            <PencilSquareIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="personal-info-el">
                        <div>
                            <PhoneIcon className="h-6 w-6" />
                            <p className="s-font">Phone</p>
                            <p>{phone}</p>
                        </div>
                        <button>
                            <PencilSquareIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="personal-info-el">
                        <div>
                            <KeyIcon className="h-6 w-6" />
                            <p className="s-font">Password</p>
                        </div>
                        <button>
                            <PencilSquareIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="profile">
                <h1>Account actions</h1>
                <div className="personal-info">
                    <div className="personal-info-el">
                        <div>
                            <ArrowRightOnRectangleIcon className="h-6 w-6" />
                            <p className="s-font">Log yourself out:</p>
                        </div>

                        <button
                            style={{
                                background: 'var(--green-color)',
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                                padding: '0.5em 1.5em',
                                borderRadius: '2em',
                                color: 'white',
                            }}
                            onClick={handleLogOut}
                        >
                            Log Out
                        </button>
                    </div>
                    <div className="personal-info-el">
                        <div>
                            <UserMinusIcon className="h-6 w-6" />
                            <p className="s-font">Delete your account:</p>
                        </div>
                        <button
                            style={{
                                background: 'var(--red-color)',
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                                padding: '0.5em 1.5em',
                                borderRadius: '2em',
                                color: 'white',
                            }}
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
