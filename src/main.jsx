import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import axios from 'axios'

import { BrowserRouter } from 'react-router-dom';

axios.defaults.withCredentials = true;

ReactDOM.createRoot(
    document.getElementById('root')
).render(

  <React.StrictMode>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </React.StrictMode>
);
