import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Use import.meta.env for Vite environment variables
    withCredentials: true // Send cookies automatically
});

export default API;
