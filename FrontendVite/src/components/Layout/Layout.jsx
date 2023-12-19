import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/main.css';

export default function Layout() {
    return (
        <>
            <Header />
            <main style={{ padding: '2em', minHeight: '100vh' }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
