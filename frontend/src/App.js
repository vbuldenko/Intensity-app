import React from 'react';
import './App.css';
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

function App() {
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
                        <Route path="clients" element={<Clients />} />
                        <Route path="team" element={<Team />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
