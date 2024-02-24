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
import Home from './components/Layout/Home';
import Services from './components/Layout/Services';
import Schedule from './components/Schedule/Schedule';
import Prices from './components/Layout/Prices';
import Contacts from './components/Layout/Contacts';
import NotFound from './components/Layout/NotFound';

import LoginForm from './components/Forms/LoginForm';
import SignUpForm from './components/Forms/SignUpForm';
import ForgotPasswordForm from './components/Forms/ForgotPasswordForm';
import ResetPasswordForm from './components/Forms/ResetPasswordForm';

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

import storageService from './services/storage';
import { initializeUsers } from './reducers/usersReducer';
import { loadLoggedInUser } from './reducers/loginReducer';
import { initializeTrainings } from './reducers/trainingReducer';
import {
    initializeAllAbonements,
    initializeUserAbonements,
} from './reducers/abonementReducer';
import { getStatistics } from './reducers/statisticsReducer';

export default function App() {
    const { theme, fontSize } = useAppContext();
    const dispatch = useDispatch();
    const isAuthenticated = storageService.loadUser() ? true : false;
    const user = useSelector(({ user }) => user);

    // const fontSize = user.settings?.fontSize;
    const style = fontSize ? { fontSize: `${fontSize}px` } : null;

    useEffect(() => {
        const fetchData = async () => {
            console.log('App useEffect');

            try {
                if (isAuthenticated) {
                    const actions = [
                        dispatch(loadLoggedInUser()),
                        dispatch(initializeTrainings()),
                    ];

                    const loggedInUser = storageService.loadUser();

                    if (loggedInUser) {
                        if (loggedInUser.role === 'client') {
                            actions.push(dispatch(initializeUserAbonements()));
                        } else if (loggedInUser.role === 'admin') {
                            actions.push(
                                dispatch(initializeUsers()),
                                dispatch(initializeAllAbonements()),
                                dispatch(getStatistics())
                            );
                        }
                    }

                    await Promise.all(actions);
                }
            } catch (error) {
                // Handle errors here
                console.error('Error in useEffect:', error);
            }
        };

        fetchData();
    }, [isAuthenticated, dispatch]);

    return (
        <div
            style={style}
            className={`App ${theme === 'light' ? 'light' : 'dark'}`}
        >
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="services" element={<Services />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="prices" element={<Prices />} />
                    <Route path="contacts" element={<Contacts />} />
                    <Route path="sign-in" element={<LoginForm />} />
                    <Route path="sign-up" element={<SignUpForm />} />
                    <Route
                        path="forgot-password"
                        element={<ForgotPasswordForm />}
                    />
                    <Route
                        path="reset-password/:resetToken"
                        element={<ResetPasswordForm />}
                    />
                    <Route element={<AuthProtected />}>
                        <Route path="account" element={<Account user={user} />}>
                            <Route index element={<Overview user={user} />} />
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
