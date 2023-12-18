import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';
import { UserCircleIcon } from '@heroicons/react/24/outline';

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
                intensity
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

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1em',
                    }}
                >
                    {user ? (
                        <NavLink
                            to="/account"
                            activeClassName="active"
                            onClick={closeMobileMenu}
                        >
                            <UserCircleIcon className="h-6 w-6 text-green-800" />
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
                    <ThemeToggle />
                </div>
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
