import './styles/App.css';
import './styles/form.css';
import './styles/main.css';
import './styles/schedule.css';
import './styles/account.css';
import { useAppContext } from './context/Context';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Schedule from './components/Schedule/Schedule';
import Prices from './pages/Prices';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';

import Login from './pages/Forms/Login';
import SignUp from './pages/Forms/SignUp';
import ForgotPassword from './pages/Forms/ForgotPassword';
import ResetPassword from './pages/Forms/ResetPassword';

import AuthProtected from './components/Layout/AuthRequired';
import Account from './components/Account/Account';
import Overview from './components/Account/Overview';
import TrainerOverview from './components/Account/Trainer/TrainerOverview';
import Purchases from './components/Account/Client/Purchases';
import Clients from './components/Account/Admin/Clients';
import Client from './components/Account/Admin/Client';
import Team from './components/Account/Admin/Team';
import Trainer from './components/Account/Admin/Trainer';
import Settings from './components/Account/Settings';

import { initializeUsers } from './reducers/userReducer';
import { loadLoggedInUser } from './reducers/userReducer';
import { initializeTrainings } from './reducers/trainingReducer';
import {
    initializeAllAbonements,
    initializeUserAbonements,
} from './reducers/abonementReducer';
import { getStatistics } from './reducers/statisticsReducer';
import { changeFontSize } from './utils';

export default function App() {
    const { theme } = useAppContext();
    const dispatch = useDispatch();
    const user = useSelector(({ user }) => user);
    user.data && changeFontSize(user.data.settings.fontSize);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(loadLoggedInUser());
            try {
                if (user.isAuthenticated) {
                    const actions = [dispatch(initializeTrainings())];
                    if (user.data.role === 'client') {
                        actions.push(dispatch(initializeUserAbonements()));
                    } else if (user.data.role === 'admin') {
                        actions.push(
                            dispatch(initializeUsers()),
                            dispatch(initializeAllAbonements()),
                            dispatch(getStatistics())
                        );
                    }
                    await Promise.all(actions);
                }
            } catch (error) {
                // Handle errors here
                console.error('Error in useEffect:', error);
            }
        };

        fetchData();
    }, [user.isAuthenticated]);

    return (
        <div className={`App ${theme === 'light' ? 'light' : 'dark'}`}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="services" element={<Services />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="prices" element={<Prices />} />
                    <Route path="contacts" element={<Contacts />} />
                    <Route path="sign-in" element={<Login />} />
                    <Route path="sign-up" element={<SignUp />} />
                    <Route
                        path="forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="reset-password/:resetToken"
                        element={<ResetPassword />}
                    />
                    <Route element={<AuthProtected />}>
                        <Route
                            path="account"
                            element={<Account user={user.data} />}
                        >
                            <Route
                                index
                                element={<Overview user={user.data} />}
                            />
                            <Route path="purchases" element={<Purchases />} />
                            <Route path="schedule" element={<Schedule />} />
                            <Route
                                path="trainings"
                                element={<TrainerOverview />}
                            />
                            <Route path="clients" element={<Clients />} />
                            <Route path="clients/:id" element={<Client />} />
                            <Route path="team" element={<Team />} />
                            <Route path="team/:id" element={<Trainer />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}
