import '../styles/admin.css';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function Admin() {
    const activeStyles = {
        fontWeight: '800',
        color: 'rgb(255, 255, 255, 0.5)',
        background: 'rgba(130, 130, 130, 0.1)',
        // borderBottom: '1px solid rgba(130, 130, 130, 0.2)',
        // borderTop: '1px solid rgba(130, 130, 130, 0.2)',
    };

    const styleChanger = ({ isActive }) => (isActive ? activeStyles : null);

    return (
        <section className="admin-section">
            <nav className="admin-menu">
                <NavLink to={'.'} end style={styleChanger} className="active">
                    Overview
                </NavLink>
                <NavLink to={'schedule'} style={styleChanger}>
                    Schedule
                </NavLink>
                <NavLink to={'trainings'} style={styleChanger}>
                    Trainings
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
            <div className="admin-section-content">
                <Outlet />
            </div>
        </section>
    );
}

export default Admin;
