import '../styles/account.css';
import Menu from './Menu';
import { Outlet } from 'react-router-dom';

export default function Account({ user }) {
    if (!user) {
        return null;
    }

    return (
        <section className="account-section">
            <nav className="account-menu">
                <Menu role={user.role} />
            </nav>
            <div className="account-content">
                <Outlet />
            </div>
        </section>
    );
}
