import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useTranslation } from 'react-i18next';
import './Style/RegisterStyles.css';
import Swal from '../utils/swalWithFont';
import { isValidPhoneNumber } from 'libphonenumber-js';

const Register = ({ onToggleForm }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		password: ''
	});
	// Validate form fields using custom logic.
	const validateFormData = (data) => {
		const { name, phone, email, password } = data;
	
		// Name validation: at least 2 characters.
		if (name.trim().length < 2) {
		  return t('register.validation.name'); // e.g., "Name must be at least 2 characters long."
		}
	
		// Phone validation using your provided logic.
		if (!isValidPhoneNumber(phone)) {
			return t('register.validation.phone'); // e.g., "Please enter a valid phone number."
		}
	
		// Email validation: basic email regex.
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
		  return t('register.validation.email'); // e.g., "Please enter a valid email address."
		}
	
		// Password validation: at least 6 characters.
		if (password.length < 6) {
		  return t('register.validation.password'); // e.g., "Password must be at least 6 characters long."
		}
	
		return null;
	  };	

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => { // We need do phone validation!
		e.preventDefault();
		// Run validations.
		const validationError = validateFormData(formData);
		if (validationError) {
		  await Swal.fire({
			icon: 'warning',
			title: t("register.validationErrorTitle"),
			text: validationError,
			confirmButtonText: t("register.confirmButton")
		  });
		  return;
		}

		try {
			const response = await API.post('/users/register', formData);
			await Swal.fire({
				icon: 'success',
				title: t("register.successTitle"),
				text: t("register.successMessage"),
				confirmButtonText: t("register.confirmButton")
			});
			onToggleForm();
		} catch (error) {
			const message = error.response?.data?.message || t("register.errorMessage");
			await Swal.fire({
				icon: 'error',
				title: t("register.errorTitle"),
				text: message,
				confirmButtonText: t("register.confirmButton")
			});
		}
	};

	return (
		<div className="register-container">
			<h2 className="register-title">{t("register.title")}</h2>
			<form className="register-form" onSubmit={handleSubmit}>
				<div className="input-group">
					<label>{t("register.nameLabel")}</label>
					<input
						type="text"
						name="name"
						placeholder={t("register.namePlaceholder")}
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="input-group">
					<label>{t("register.phoneLabel")}</label>
					<input
						type="text"
						name="phone"
						placeholder={t("register.phonePlaceholder")}
						value={formData.phone}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="input-group">
					<label>{t("register.emailLabel")}</label>
					<input
						type="email"
						name="email"
						placeholder={t("register.emailPlaceholder")}
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="input-group">
					<label>{t("register.passwordLabel")}</label>
					<input
						type="password"
						name="password"
						placeholder={t("register.passwordPlaceholder")}
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit" className="submit-button">
					{t("register.submitButton")}
				</button>
				<div className="register-buttons">
					<button
						type="button"
						className="secondary-button"
						onClick={onToggleForm}
					>
						{t("register.loginButton")}
					</button>
				</div>
			</form>
		</div>
	);
};

export default Register;
