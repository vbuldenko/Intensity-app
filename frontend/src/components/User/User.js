import './styles/user.css';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logUserOut } from '../../reducers/loginReducer';

export default function User({ user }) {
    const dispatch = useDispatch();

    const activeStyles = {
        fontWeight: '800',
        textDecoration: 'underline',
        color: '#000000',
    };

    const styleChanger = ({ isActive }) => (isActive ? activeStyles : null);

    return (
        <section className="user-section">
            <nav className="user-menu">
                <NavLink to={'.'} end style={styleChanger}>
                    Overview
                </NavLink>
                <NavLink to={'schedule'} style={styleChanger}>
                    Schedule
                </NavLink>
                <NavLink to={'settings'} style={styleChanger}>
                    Settings
                </NavLink>
                <button
                    className="logout-button"
                    onClick={() => dispatch(logUserOut())}
                >
                    Log Out
                </button>
            </nav>
            <Outlet context={user} />
        </section>
    );
}
