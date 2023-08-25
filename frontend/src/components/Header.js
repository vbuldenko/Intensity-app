import './styles/Header.css';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logUserOut } from '../reducers/userReducer';

export default function Header() {
    const user = useSelector(({ user }) => user);
    const dispatch = useDispatch();

    const activeStyles = {
        fontWeight: '800',
        textDecoration: 'underline',
        color: '#ffffff',
    };

    const styleChanger = ({ isActive }) => (isActive ? activeStyles : null);

    return (
        <header className="main-header">
            <Link className="logo" to="/">
                In10sity
            </Link>
            <nav className="main-navbar">
                <NavLink to="/services" style={styleChanger}>
                    Services
                </NavLink>
                <NavLink to="/schedule" style={styleChanger}>
                    Schedule
                </NavLink>
                <NavLink to="/prices" style={styleChanger}>
                    Prices
                </NavLink>
                <NavLink to="/contacts" style={styleChanger}>
                    Contacts
                </NavLink>
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
                    <NavLink to="/login" style={styleChanger}>
                        Login
                    </NavLink>
                )}
                <NavLink to="/account" style={styleChanger}>
                    Personal account
                </NavLink>
            </nav>
        </header>
    );
}
