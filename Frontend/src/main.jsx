import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { AppProvider } from './context/Context.jsx';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <React.StrictMode>
                <AppProvider>
                    <App />
                </AppProvider>
            </React.StrictMode>
        </BrowserRouter>
    </Provider>
);
