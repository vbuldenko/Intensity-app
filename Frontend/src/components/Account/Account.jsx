import Menu from './Menu';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/Context';

export default function Account({ user }) {
    const { theme } = useAppContext();
    if (!user) {
        return null;
    }

    return (
        <section
            className={`account-section ${
                theme === 'light' ? 'light' : 'dark'
            }`}
        >
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
