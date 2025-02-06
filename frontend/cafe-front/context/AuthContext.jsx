import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [accessToken, setAccessToken] = useState(null);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await API.get('/users/profile', {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				setIsAuthenticated(true);
			} catch (error) {
				if (error.response?.status === 401) {
					setIsAuthenticated(false);
				}
			} finally {
				setIsCheckingAuth(false);
			}
		};

		if (isCheckingAuth && accessToken) checkAuth();
	}, [isCheckingAuth, accessToken]);

	const login = (token) => {
		setAccessToken(token);
		setIsAuthenticated(true);
	};

	const logout = async () => {
		try {
			await API.post('/users/logout');
			setAccessToken(null);
			setIsAuthenticated(false);
			alert('Logged out successfully!');
			navigate('/');
			
		} catch (error) {
			console.error('Error logging out:', error.message);
		}
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout, isCheckingAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
