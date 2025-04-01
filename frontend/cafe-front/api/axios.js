import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false // false for token-based auth, true for cookie-based
});

// Add interceptor to attach token to every request
API.interceptors.request.use(
	(config) => {
	  const token = localStorage.getItem('accessToken');
	  if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	  }
	  return config;
	},
	(error) => Promise.reject(error)
  );

export default API;
