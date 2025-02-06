import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true // Send cookies automatically
});

// Add access token to the request headers
API.interceptors.request.use(
    (config) => {
        const token = AuthContext._currentValue?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
