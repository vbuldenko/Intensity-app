import './styles/user.css';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logUserOut } from '../../reducers/loginReducer';

export default function User() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const activeStyles = {
        fontWeight: '800',
        textDecoration: 'underline',
        color: '#000000',
    };

    const styleChanger = ({ isActive }) => (isActive ? activeStyles : null);
    const handleLogOut = () => {
        dispatch(logUserOut());
        navigate('/sign-in'); //Maybe there no need for this?
    };

    return (
        <section className="user-section">
            <nav className="user-menu">
                <NavLink to={'.'} end style={styleChanger}>
                    Overview
                </NavLink>
                <NavLink to={'schedule'} style={styleChanger}>
                    Schedule
                </NavLink>
                <NavLink to={'purchases'} style={styleChanger}>
                    Purchases
                </NavLink>
                <NavLink to={'settings'} style={styleChanger}>
                    Settings
                </NavLink>
                <button className="logout-button" onClick={handleLogOut}>
                    Log Out
                </button>
            </nav>
            <Outlet />
        </section>
    );
}
