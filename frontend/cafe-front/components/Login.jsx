import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import './Style/LoginStyles.css';
import Swal from '../utils/swalWithFont';

const Login = ({ onToggleForm, onForgotPassword }) => {
	const { t } = useTranslation();
	const { login } = useContext(AuthContext); // Access the login function
	const navigate = useNavigate();
	const useCookieAuth = import.meta.env.VITE_USE_COOKIE_AUTH === 'true';
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await API.post('/users/login', formData);
			const { token, role } = response.data;
			if (!useCookieAuth && token) {
				window.localStorage.setItem('accessToken', token);
			}
			await login();
			await Swal.fire({
				icon: 'success',
				title: t("login.successTitle"),
				text: t("login.successMessage"),
				confirmButtonText: t("login.confirmButton")
			}).then(() => {
				if (role === 'admin') {
					navigate('/admin');
				} else {
					navigate('/');
				}
			});
		} catch (error) {
			const message = error.response?.data?.message || t("login.errorMessage");
			await Swal.fire({
				icon: 'error',
				title: t("login.errorTitle"),
				text: message,
				confirmButtonText: t("login.confirmButton")
			});
		}
	};

	return (
		<div className="login-container">
			<h2 className="login-title">{t("login.title")}</h2>
			<form className="login-form" onSubmit={handleSubmit}>
				<div className="input-group">
					<label>{t("login.emailLabel")}</label>
					<input
						type="email"
						name="email"
						placeholder={t("login.emailPlaceholder")}
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="input-group">
					<label>{t("login.passwordLabel")}</label>
					<input
						type="password"
						name="password"
						placeholder={t("login.passwordPlaceholder")}
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit" className="submit-button">
					{t("login.submitButton")}
				</button>
				<div className="login-buttons">
					<button
						type="button"
						className="secondary-button"
						onClick={onToggleForm}
					>
						{t("login.registerButton")}
					</button>
					<button type="button" className="secondary-button" onClick={() => onForgotPassword()}>
						{t("login.forgotPassword")}
					</button>
				</div>
			</form>
		</div>
	);
};

export default Login;
