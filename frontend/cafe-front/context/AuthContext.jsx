import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const { t } = useTranslation();
  
	// Fetch the user profile using the provided token.
	const fetchUserProfile = useCallback(async () => {
		try {
			const response = await API.get('/users/profile');
			setUser(response.data);
			setIsAuthenticated(true);
		} catch (error) {
			setUser(null);
			setIsAuthenticated(false);
		}
	}, []);
  
	useEffect(() => {
		let isMounted = true;
		const checkAuth = async () => {
			try {
				await fetchUserProfile();
			} catch (err) {
				console.error('Auth check error:', err);
			} finally {
				if (isMounted) setIsCheckingAuth(false);
			}
		};
		checkAuth();
		return () => {
			isMounted = false;
		};
	}, [fetchUserProfile]);
  
	const login = async () => {
		await fetchUserProfile();
	};
  
	// Logout: call API to logout, clear local storage, update state, and notify the user.
	const logout = async () => {
	  try {
		await API.post('/users/logout');
		setUser(null);
		setIsAuthenticated(false);
		await Swal.fire({
		  icon: 'success',
		  title: t('logout.successTitle'),
		  text: t('logout.successMessage'),
		  confirmButtonText: t('logout.confirmButton'),
		});
		navigate('/');
	  } catch (error) {
		console.error('Error logging out:', error);
		await Swal.fire({
		  icon: 'error',
		  title: t('logout.errorTitle') || 'Logout Failed',
		  text:
			t('logout.errorMessage') ||
			'An error occurred during logout. Please try again.',
		  confirmButtonText: t('logout.confirmButton') || 'OK',
		});
	  }
	};

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isCheckingAuth, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
