import React from 'react';
import './app.css';
import './input.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Schedule from './components/Schedule';
import Prices from './components/Prices';
import Contacts from './components/Contacts';
import LoginForm from './components/LoginForm';
import Account from './components/Account';

import Admin from './components/Admin/Admin';
import Overview from './components/Admin/Overview';
import AdminSchedule from './components/Admin/Schedule';
import Clients from './components/Admin/Clients';
import Settings from './components/Admin/Settings';
import Team from './components/Admin/Team';
import Layout from './components/Layout';
import Client from './components/Admin/Client';

function App() {
    const clients = {
        all: 175,
        active: 100,
        list: [
            {
                id: 1,
                fullname: 'Alice Baber',
                phone: '097-99-100-25',
                email: 'bubab@gmail.com',
                prev_abonements: [
                    {
                        purchase_date: '1.06.23',
                        activation_date: '2.06.23',
                        expiration_date: '02.07.23',
                        amount: 4,
                        expired: false,
                        completed: true,
                    },
                ],
                current_abonement: {
                    amount: 6,
                    purchase_date: '01.07.23',
                    activation_date: '01.07.23',
                    expiration_date: '01.08.23',
                    expired: false,
                    pause: 1,
                    paused: false,
                    left: 1,
                    history: [
                        {
                            date: '11.07.23',
                            time: '10:00',
                            class: 'Tabata',
                            trainer: 'Morozova',
                            deducted: false,
                            deduction_reason: null,
                        },
                        {
                            date: '15.07.23',
                            time: '12:00',
                            class: 'Fly',
                            trainer: 'Babiychuk',
                            deducted: false,
                            deduction_reason: null,
                        },
                        {
                            date: '17.07.23',
                            time: '9:00',
                            class: 'Yoga',
                            trainer: 'Morozova',
                            deducted: false,
                            deduction_reason: null,
                        },
                        {
                            date: '18.07.23',
                            time: '20:00',
                            class: 'Stretching',
                            trainer: 'Babiychuk',
                            deducted: true,
                            deduction_reason: 'unchecked at 19:00',
                        },
                        {
                            date: '22.07.23',
                            time: '19:00',
                            class: 'Heels',
                            trainer: 'Tkachuk',
                            deducted: false,
                            deduction_reason: null,
                        },
                    ],
                },
                active: true,
            },
            {
                id: 2,
                fullname: 'Margo Sokur',
                phone: '097-99-100-25',
                email: 'bubab@gmail.com',
                prev_abonements: null,
                current_abonement: {
                    amount: 4,
                    purchase_date: '01.07.23',
                    activation_date: '01.07.23',
                    expiration_date: '01.08.23',
                    expired: false,
                    pause: 1,
                    paused: false,
                    left: 2,
                    history: [
                        {
                            date: '15.07.23',
                            time: '12:00',
                            class: 'Fly',
                            trainer: 'Babiychuk',
                            deducted: false,
                            deduction_reason: null,
                        },
                        {
                            date: '17.07.23',
                            time: '9:00',
                            class: 'Yoga',
                            trainer: 'Morozova',
                            deducted: false,
                            deduction_reason: null,
                        },
                    ],
                },
                active: true,
            },
        ],
    };
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="prices" element={<Prices />} />
                    <Route path="contacts" element={<Contacts />} />
                    {/* <Route path="/users" element={<Users users={users} />} /> */}
                    {/* <Route
                        path="/users/:id"
                        element={<User user={selectedUser} />}
                    /> */}
                    <Route path="login" element={<LoginForm />} />

                    <Route path="account" element={<Admin />}>
                        <Route index element={<Overview />} />
                        <Route path="schedule" element={<AdminSchedule />} />
                        <Route
                            path="clients"
                            element={<Clients clients={clients} />}
                        />
                        <Route
                            path="clients/:id"
                            element={<Client list={clients.list} />}
                        />
                        <Route path="team" element={<Team />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
