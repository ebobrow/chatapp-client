import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import { API_URL } from './constants';
import { axiosErrorHandler } from './api';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  r => r, // Any way to ignore this one?
  axiosErrorHandler
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
