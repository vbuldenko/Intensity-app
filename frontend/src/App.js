import React from 'react';
import './app.css';
import './input.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Schedule from './components/Schedule/Schedule';
import Prices from './components/Prices';
import Contacts from './components/Contacts';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import NotFound from './components/NotFound';

import Admin from './components/Admin/Admin';
import User from './components/User/User';
import Overview from './components/Admin/Overview';
import AdminSchedule from './components/Admin/Schedule';
import Clients from './components/Admin/Clients';
import Settings from './components/Admin/Settings';
import Team from './components/Admin/Team';
import Trainer from './components/Admin/Trainer';
import Layout from './components/Layout';
import Client from './components/Admin/Client';
import AuthProtected from './components/AuthRequired';

import { loadLoggedInUser } from './reducers/userReducer';

import { clients } from './test_data/data';
import { trainers } from './test_data/data';

export default function App() {
    const dispatch = useDispatch();
    const userRole = '';

    useEffect(() => {
        dispatch(loadLoggedInUser());
    }, []);

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
                        <Route
                            path="account"
                            element={
                                userRole === 'admin' ? <Admin /> : <User />
                            }
                        >
                            <Route index element={<Overview />} />
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
