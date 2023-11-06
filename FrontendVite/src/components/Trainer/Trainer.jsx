import '../User/styles/user.css';
import { NavLink, Outlet } from 'react-router-dom';

export default function Trainer() {
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
                <NavLink to={'purchases'} style={styleChanger}>
                    Purchases
                </NavLink>
                <NavLink to={'settings'} style={styleChanger}>
                    Settings
                </NavLink>
            </nav>
            <Outlet />
        </section>
    );
}
