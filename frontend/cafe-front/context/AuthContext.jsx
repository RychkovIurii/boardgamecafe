import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
		  try {
			const response = await API.get('/users/profile');
			setIsAuthenticated(true);
		  } catch (error) {
			setIsAuthenticated(false);
		  } finally {
			setIsCheckingAuth(false);
		  }
		};
		
		checkAuth();
	  }, []);

    const login = (token) => {
		setIsAuthenticated(true);
	  };

    const logout = async () => {
        try {
            await API.post('/users/logout');
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
