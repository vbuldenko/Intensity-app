import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logUserOut } from '../reducers/userReducer';
import './menu.css';

const Menu = ({ user }) => {
    const dispatch = useDispatch();

    return (
        <div className="menu">
            <div className="menu-links">
                <Link className="menu-link" to={'/'}>
                    blogs
                </Link>
                <Link className="menu-link" to={'/users'}>
                    users
                </Link>
                {user ? (
                    <div className="user-info">
                        <span>{user.name} logged in</span>
                        <button
                            className="logout-button"
                            onClick={() => dispatch(logUserOut())}
                        >
                            logout
                        </button>
                    </div>
                ) : (
                    <Link className="menu-link" to="/login">
                        login
                    </Link>
                )}
            </div>
            <h2 className="app-title">Blog App</h2>
        </div>
    );
};

export default Menu;
