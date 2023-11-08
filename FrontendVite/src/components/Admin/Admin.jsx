import '../styles/admin.css';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function Admin() {
    const activeStyles = {
        fontWeight: '800',
        textDecoration: 'underline',
        color: '#000000',
    };

    const styleChanger = ({ isActive }) => (isActive ? activeStyles : null);

    return (
        <section className="admin-section">
            <nav className="admin-menu">
                <NavLink to={'.'} end style={styleChanger}>
                    Overview
                </NavLink>
                <NavLink to={'schedule'} style={styleChanger}>
                    Schedule
                </NavLink>
                <NavLink to={'clients'} style={styleChanger}>
                    Clients
                </NavLink>
                <NavLink to={'team'} style={styleChanger}>
                    Team
                </NavLink>
                <NavLink to={'settings'} style={styleChanger}>
                    Settings
                </NavLink>
            </nav>
            <Outlet />
        </section>
    );
}

export default Admin;
