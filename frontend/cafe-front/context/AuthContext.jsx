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
			  // Check if token exists before making request
			  const token = localStorage.getItem('accessToken');
			  if (!token) {
				  setIsAuthenticated(false);
				  setIsCheckingAuth(false);
				  return;
			  }
  
			  // Send request if token is present
			  const response = await API.get('/users/profile', {
				  headers: { Authorization: `Bearer ${token}` }
			  });
			  setIsAuthenticated(true);
			} catch (error) {
			  if (error.response && error.response.status === 401) {
				  console.warn("User is not logged in.");
			  } else {
				  console.error("Auth check failed:", error);
			  }
			  setIsAuthenticated(false);
			} finally {
			  setIsCheckingAuth(false);
			}
		  };
		
		checkAuth();
	  }, []);

    const login = (token) => {
		localStorage.setItem('accessToken', token);
		setIsAuthenticated(true);
	  };

    const logout = async () => {
        try {
            await API.post('/users/logout');
			localStorage.removeItem('accessToken');
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
