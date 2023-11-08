import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import Home from './components/Home';
import Services from './components/Services';
import Schedule from './components/Schedule/Schedule';
import Prices from './components/Prices';
import Contacts from './components/Contacts';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import NotFound from './components/NotFound';

import Account from './components/Account';
import Overview from './components/Admin/Overview';
import UserOverview from './components/User/UserOverview';
import Purchases from './components/User/Purchases';
import AdminSchedule from './components/Admin/Schedule';
import Clients from './components/Admin/Clients';
import Settings from './components/Admin/Settings';
import Team from './components/Admin/Team';
import Trainer from './components/Admin/Trainer';
import Layout from './components/Layout';
import Client from './components/Admin/Client';
import AuthProtected from './components/AuthRequired';

import storageService from './services/storage';

import { loadLoggedInUser } from './reducers/loginReducer';
import { initializeTrainings } from './reducers/trainingReducer';
import {
    initializeAllAbonements,
    initializeUserAbonements,
} from './reducers/abonementReducer';

import { clients } from './test_data/data';
import { trainers } from './test_data/data';

export default function App() {
    const dispatch = useDispatch();
    const isAuthenticated = storageService.loadUser() ? true : false;
    const user = useSelector(({ user }) => user);
    console.log('App user role:');

    useEffect(() => {
        console.log('App useEffect run');
        if (isAuthenticated) {
            dispatch(loadLoggedInUser());
            dispatch(initializeTrainings());
            // user &&
            //     (user.role === 'client'
            //         ? dispatch(initializeUserAbonements())
            //         : dispatch(initializeAllAbonements()));
            // dispatch(initializeUserAbonements());
            dispatch(initializeAllAbonements());
        }
    }, [isAuthenticated]);

    return (
        <div className="App">
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
                        <Route path="account" element={<Account />}>
                            <Route
                                index
                                element={
                                    user && user.role === 'admin' ? (
                                        <Overview />
                                    ) : (
                                        <UserOverview />
                                    )
                                }
                            />
                            <Route path="purchases" element={<Purchases />} />
                            <Route
                                path="schedule"
                                element={<AdminSchedule />}
                            />
                            <Route
                                path="clients"
                                element={<Clients clients={clients} />}
                            />
                            <Route
                                path="clients/:id"
                                element={<Client list={clients.list} />}
                            />
                            <Route
                                path="team"
                                element={<Team trainers={trainers} />}
                            />
                            <Route
                                path="team/:trainerId"
                                element={<Trainer trainers={trainers} />}
                            />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}
