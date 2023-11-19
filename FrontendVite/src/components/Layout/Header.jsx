import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/Header.css';

export default function Header() {
    const user = useSelector(({ user }) => user);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const closeMobileMenu = () => {
        setShowMobileMenu(false);
    };

    return (
        <header className="main-header">
            <Link className="logo" to="/">
                Intensity
            </Link>
            <div
                className={`main-navbar ${showMobileMenu ? 'show-mobile' : ''}`}
            >
                <NavLink
                    to="/services"
                    activeClassName="active"
                    onClick={closeMobileMenu}
                >
                    Services
                </NavLink>
                <NavLink
                    to="/schedule"
                    activeClassName="active"
                    onClick={closeMobileMenu}
                >
                    Schedule
                </NavLink>
                <NavLink
                    to="/prices"
                    activeClassName="active"
                    onClick={closeMobileMenu}
                >
                    Prices
                </NavLink>
                <NavLink
                    to="/contacts"
                    activeClassName="active"
                    onClick={closeMobileMenu}
                >
                    Contacts
                </NavLink>
                {user ? (
                    <NavLink
                        to="/account"
                        activeClassName="active"
                        onClick={closeMobileMenu}
                    >
                        My account
                    </NavLink>
                ) : (
                    <NavLink
                        to="/sign-in"
                        activeClassName="active"
                        onClick={closeMobileMenu}
                    >
                        Log In/Sign Up
                    </NavLink>
                )}
            </div>
            <div
                className={`burger-icon ${showMobileMenu ? 'open' : ''}`}
                onClick={toggleMobileMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
    );
}
