import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
    return (
        <>
            <Header />
            <main style={{ padding: '2em 0', minHeight: '100vh' }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
