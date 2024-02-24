import { NavLink } from 'react-router-dom';

export default function Menu({ role }) {
    const activeStyles = {
        fontWeight: '700',
        background: 'var(--green-color3)',
        color: 'white',
        boxShadow: 'var(--card-element-shadow3)',
        // background: 'var(--selected-tab-background)',
    };

    const styleChanger = ({ isActive }) => (isActive ? activeStyles : null);

    return role === 'admin' ? (
        <>
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
        </>
    ) : role === 'trainer' ? (
        <>
            <NavLink to={'.'} end style={styleChanger}>
                Overview
            </NavLink>
            <NavLink to={'schedule'} style={styleChanger}>
                Schedule
            </NavLink>
            <NavLink to={'settings'} style={styleChanger}>
                Settings
            </NavLink>
        </>
    ) : (
        <>
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
        </>
    );
}
