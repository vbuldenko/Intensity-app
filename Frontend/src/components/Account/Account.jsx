import Menu from './Menu';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Account({ user }) {
    const { theme } = useTheme();
    if (!user) {
        return null;
    }

    return (
        <section className="account-section">
            <nav
                className={`account-menu ${
                    theme === 'light' ? 'light' : 'dark'
                }`}
            >
                <Menu role={user.role} />
            </nav>
            <div className="account-content">
                <Outlet />
            </div>
        </section>
    );
}
