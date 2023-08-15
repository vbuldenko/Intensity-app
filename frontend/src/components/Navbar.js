import './Navbar.css';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logUserOut } from '../reducers/userReducer';

function Navbar({ user }) {
    const dispatch = useDispatch();
    return (
        <nav className="Navbar">
            <ul className="Navbar-list">
                <Link to={'/'}>
                    <li className="Navbar-item">Home</li>
                </Link>
                <Link to={'/about'}>
                    <li className="Navbar-item">About</li>
                </Link>
                <Link to={'/services'}>
                    <li className="Navbar-item">Services</li>
                </Link>
                <Link to={'/schedule'}>
                    <li className="Navbar-item">Schedule</li>
                </Link>
                <Link to={'/prices'}>
                    <li className="Navbar-item">Prices</li>
                </Link>
                <Link to={'/contacts'}>
                    <li className="Navbar-item">Contacts</li>
                </Link>
                {user ? (
                    <div className="user-info">
                        <span>{user.name} logged in</span>
                        <button
                            className="logout-button"
                            onClick={() => dispatch(logUserOut())}
                        >
                            logout
                        </button>
                    </div>
                ) : (
                    <Link to={'/login'}>
                        <li className="Navbar-item">Login</li>
                    </Link>
                )}
                <Link to={'/account'}>
                    <li className="Navbar-item">Personal account</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Navbar;
