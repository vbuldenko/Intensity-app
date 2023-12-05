import { Outlet, Navigate, useLocation } from 'react-router-dom';
import storageService from '../../services/storage';

export default function AuthProtected() {
    const isAuthenticated = storageService.loadUser();
    const location = useLocation(); //Used for the state property to remember where user came from before it was redirected from protected route
    // const [isLoading, setIsLoading] = useState(true);

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/sign-in"
                replace
                state={{
                    message: 'You must log in first',
                    from: location.pathname,
                }}
            />
        ); //replace - to delete sign in path from history stack
    }

    return <Outlet />;
}
