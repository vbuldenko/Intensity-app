import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import storageService from '../services/storage';

import { loadLoggedInUser } from '../reducers/loginReducer';
import { initializeAbonements } from '../reducers/abonementReducer';
import { initializeTrainings } from '../reducers/trainingReducer';

export default function AuthProtected() {
    const dispatch = useDispatch();
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

    useEffect(() => {
        dispatch(loadLoggedInUser());
        // dispatch(initializeAbonements());
        // dispatch(initializeTrainings());
    }, []);

    return <Outlet />;
}
