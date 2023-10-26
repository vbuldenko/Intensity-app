import './styles/user.css';
import { useState, useEffect } from 'react';
import anzhphoto from '../../images/anzhel.jpg';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logUserOut } from '../../reducers/userReducer';
import usersService from '../../services/users';

export default function User({ user }) {
    const [userData, setUserData] = useState(null);

    console.log(userData);
    const dispatch = useDispatch();

    const activeStyles = {
        fontWeight: '800',
        textDecoration: 'underline',
        color: '#000000',
    };

    const styleChanger = ({ isActive }) => (isActive ? activeStyles : null);

    useEffect(() => {
        if (user) {
            usersService.getUserById(user.id).then((data) => setUserData(data));
        }
    }, [user]);

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
            <Outlet context={userData} />
        </section>
    );
}
