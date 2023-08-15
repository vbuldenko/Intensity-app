import React from 'react';
import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import Header from './components/Header';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
    return (
        <div className="App">
            <Navbar />
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contacts" element={<Contact />} />
                    {/* <Route path="/users" element={<Users users={users} />} /> */}
                    {/* <Route
                        path="/users/:id"
                        element={<User user={selectedUser} />}
                    /> */}
                    <Route path="/login" element={<LoginForm />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
