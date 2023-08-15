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
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
    return (
        <div className="App">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/prices" element={<Prices />} />
                    <Route path="/contacts" element={<Contacts />} />
                    {/* <Route path="/users" element={<Users users={users} />} /> */}
                    {/* <Route
                        path="/users/:id"
                        element={<User user={selectedUser} />}
                    /> */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/account" element={<Account />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
