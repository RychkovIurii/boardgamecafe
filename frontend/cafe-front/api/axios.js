import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4242',
    withCredentials: true
});

export default API;
