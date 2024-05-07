import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeToggle from '../Elements/ThemeToggle';
import { useAppContext } from '../../context/Context';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import BurgerButton from '../Elements/BurgerButton';
import { getLinkClass } from '../../utils/helpers';

export default function Header() {
    const { theme } = useAppContext();
    const themeClass = theme === 'light' ? 'light' : 'dark';

    const user = useSelector(({ user }) => user);

    const [visible, setVisible] = useState(false);

    const toggleMobileMenu = () => {
        setVisible(!visible);
    };

    const closeMobileMenu = () => {
        setVisible(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Check if the click target is outside of the header
            if (!event.target.closest('.header')) {
                setVisible(false); // Close the mobile menu
            }
        };

        // Add event listener to handle clicks outside of the header navbar
        document.body.addEventListener('click', handleOutsideClick);

        // Cleanup: remove event listener when component unmounts
        return () => {
            document.body.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <header className={`m-font header ${themeClass}`}>
            <Link className="logo" to="/">
                Intensity
            </Link>
            <nav className={`header-navbar ${visible ? 'mobile' : ''}`}>
                <NavLink
                    to="/services"
                    className={getLinkClass}
                    onClick={closeMobileMenu}
                >
                    Services
                </NavLink>
                <NavLink
                    to="/schedule"
                    className={getLinkClass}
                    onClick={closeMobileMenu}
                >
                    Schedule
                </NavLink>
                <NavLink
                    to="/prices"
                    className={getLinkClass}
                    onClick={closeMobileMenu}
                >
                    Prices
                </NavLink>
                <NavLink
                    to="/contacts"
                    className={getLinkClass}
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
                    {user.data ? (
                        <NavLink
                            to="/account"
                            className={getLinkClass}
                            onClick={closeMobileMenu}
                        >
                            <UserCircleIcon className="h-6 w-6" />
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/sign-in"
                            className={getLinkClass}
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
