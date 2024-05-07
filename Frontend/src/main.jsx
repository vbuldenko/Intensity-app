import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { GlobalContextProvider } from './context/Context.jsx';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <React.StrictMode>
                <GlobalContextProvider>
                    <App />
                </GlobalContextProvider>
            </React.StrictMode>
        </BrowserRouter>
    </Provider>
);
