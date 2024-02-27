import { useAppContext } from '../../context/Context';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logUserOut, deleteUser } from '../../reducers/userReducer';
import storageService from '../../services/storage';

import {
    PhoneIcon,
    AtSymbolIcon,
    KeyIcon,
    IdentificationIcon,
    PencilSquareIcon,
    UserMinusIcon,
    ArrowRightOnRectangleIcon,
    AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

function Settings() {
    const { fontSize, changeFontSize } = useAppContext();
    const { id, name, email, phone, settings } = useSelector(
        ({ user }) => user.data
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFontSize = (event) => {
        const newFontSize = parseInt(event.target.value, 10);
        changeFontSize(newFontSize);
        dispatch(updateUser(id, { settings: { fontSize: newFontSize } }));
        // Implement functionality to update font size in the backend
    };

    const handleLogOut = () => {
        storageService.removeUser();
        dispatch({ type: 'RESET_STATE' });
        navigate('/sign-in'); //Maybe there no need for this?
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteUser(id));
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
                <h1>App settings</h1>
                <div className="personal-info card-el-bg">
                    <div className="personal-info-el">
                        <div>
                            <AdjustmentsHorizontalIcon className="h-4 w-4" />
                            <p className="s-font">Fontsize</p>
                        </div>

                        <select
                            id="fontSize"
                            className="s-font"
                            onChange={handleFontSize}
                            value={settings.fontSize}
                        >
                            {[10, 12, 14, 16, 18, 20].map((size) => (
                                <option key={size} value={size}>
                                    {size}px
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="profile">
                <h1>Personal information</h1>
                <div className="personal-info card-el-bg">
                    <div className="personal-info-el">
                        <div>
                            <IdentificationIcon className="h-4 w-4" />
                            <p className="s-font">Name</p>
                            <p className="red">{name}</p>
                        </div>

                        <button>
                            <PencilSquareIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="personal-info-el">
                        <div>
                            <AtSymbolIcon className="h-4 w-4" />
                            <p className="s-font">Email</p>
                            <p style={{ width: '150px' }}>{email}</p>
                        </div>
                        <button>
                            <PencilSquareIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="personal-info-el">
                        <div>
                            <PhoneIcon className="h-4 w-4" />
                            <p className="s-font">Phone</p>
                            <p>{phone}</p>
                        </div>
                        <button>
                            <PencilSquareIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="personal-info-el">
                        <div>
                            <KeyIcon className="h-4 w-4" />
                            <p className="s-font">Password</p>
                        </div>
                        <button>
                            <PencilSquareIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="profile">
                <h1>Account actions</h1>
                <div className="personal-info card-el-bg">
                    <div className="personal-info-el">
                        <div>
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
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
                            <UserMinusIcon className="h-4 w-4" />
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
