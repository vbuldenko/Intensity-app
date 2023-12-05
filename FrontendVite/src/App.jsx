import './App.css';
import background from './images/back.jpg';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Home from './components/Layout/Home';
import Services from './components/Layout/Services';
import Schedule from './components/Schedule/Schedule';
import Prices from './components/Layout/Prices';
import Contacts from './components/Layout/Contacts';
import LoginForm from './components/Layout/LoginForm';
import SignUpForm from './components/Layout/SignUpForm';
import NotFound from './components/Layout/NotFound';

import AuthProtected from './components/Layout/AuthRequired';
import Account from './components/Layout/Account';
import Overview from './components/Layout/Overview';
import Purchases from './components/User/Purchases';
import AdminSchedule from './components/Admin/Schedule';
import Clients from './components/Admin/Clients';
import Client from './components/Admin/Client';
import Team from './components/Admin/Team';
import Trainer from './components/Admin/Trainer';
import Settings from './components/Admin/Settings';

import storageService from './services/storage';

import { initializeUsers } from './reducers/usersReducer';
import { loadLoggedInUser } from './reducers/loginReducer';
import { initializeTrainings } from './reducers/trainingReducer';
import {
    initializeAllAbonements,
    initializeUserAbonements,
} from './reducers/abonementReducer';
import { getStatistics } from './reducers/statisticsReducer';
import TrainerOverview from './components/Trainer/TrainerOverview';

export default function App() {
    const dispatch = useDispatch();
    const isAuthenticated = storageService.loadUser() ? true : false;
    const user = useSelector(({ user }) => user);
    console.log('App: main');

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
        // className="App"
        // style={{
        //     backgroundImage: `url(${background})`,
        // }}
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
                    <Route element={<AuthProtected />}>
                        <Route path="account" element={<Account user={user} />}>
                            <Route index element={<Overview />} />
                            <Route path="purchases" element={<Purchases />} />
                            <Route
                                path="schedule"
                                element={<AdminSchedule />}
                            />
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
