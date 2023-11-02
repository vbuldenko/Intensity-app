import './styles/Header.css';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const user = useSelector(({ user }) => user);

    const activeStyles = {
        fontWeight: '800',
        textDecoration: 'underline',
        color: '#ffffff',
    };

    const styleChanger = ({ isActive }) => (isActive ? activeStyles : null);

    return (
        <header className="main-header">
            <Link className="logo" to="/">
                Intensity
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
                    <NavLink to="/account" style={styleChanger}>
                        My account
                    </NavLink>
                ) : (
                    <NavLink to="/sign-in" style={styleChanger}>
                        Log In
                    </NavLink>
                )}
            </nav>
        </header>
    );
}
