import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeToggle from '../Elements/ThemeToggle';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import BurgerButton from '../Elements/BurgerButton';

export default function Header() {
    const user = useSelector(({ user }) => user);

    const [visible, setVisible] = useState(false);

    const toggleMobileMenu = () => {
        setVisible(!visible);
    };

    const closeMobileMenu = () => {
        setVisible(false);
    };

    return (
        <header className="header m-font">
            <Link className="logo" to="/">
                Intensity
            </Link>
            <nav className={`header-navbar ${visible ? 'mobile' : ''}`}>
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
                            <UserCircleIcon className="h-6 w-6" />
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
            </nav>
            <BurgerButton visible={visible} toggleMenu={toggleMobileMenu} />
        </header>
    );
}
