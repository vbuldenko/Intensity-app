import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Home from './components/Layout/Home';
import Services from './components/Layout/Services';
import Schedule from './components/Schedule/Schedule';
import Prices from './components/Layout/Prices';
import Contacts from './components/Layout/Contacts';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import NotFound from './components/Layout/NotFound';

import AuthProtected from './components/AuthRequired';
import Account from './components/Account';
import Overview from './components/Overview';
import Purchases from './components/User/Purchases';
import AdminSchedule from './components/Admin/Schedule';
import Clients from './components/Admin/Clients';
import Client from './components/Admin/Client';
import Team from './components/Admin/Team';
import Trainer from './components/Admin/Trainer';
import Settings from './components/Admin/Settings';

import storageService from './services/storage';

import { loadLoggedInUser } from './reducers/loginReducer';
import { initializeTrainings } from './reducers/trainingReducer';

export default function App() {
    const dispatch = useDispatch();
    const isAuthenticated = storageService.loadUser() ? true : false;
    console.log('App:', isAuthenticated);

    useEffect(() => {
        console.log('App useEffect run');
        if (isAuthenticated) {
            dispatch(loadLoggedInUser());
            dispatch(initializeTrainings());
        } else {
            console.log('not auth render');
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
                            <Route index element={<Overview />} />
                            <Route path="purchases" element={<Purchases />} />
                            <Route
                                path="schedule"
                                element={<AdminSchedule />}
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
