import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import './Style/LoginStyles.css';

//Think about implenting mui alert
//https://mui.com/components/alert/

const Login = ({ onToggleForm }) => {
	const { t } = useTranslation();
	const { login } = useContext(AuthContext); // Access the login function
	const navigate = useNavigate();
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
			await API.post('/users/login', formData);
			alert(t("login.successMessage"));
			login(); // Update AuthContext state
			navigate('/');
		} catch (error) {
			alert(t("login.errorMessage"));
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
					<button type="button" className="secondary-button">
						{t("login.forgotPassword")}
					</button>
				</div>
			</form>
		</div>
	);
};

export default Login;
