import React, { useState } from 'react';
import API from '../api/axios';
import Swal from '../utils/swalWithFont';
import './Style/ForgotPasswordStyles.css';
import { useTranslation } from 'react-i18next';

const ForgotPassword = ({ onToggleForm }) => {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await API.post('/users/forgot-password', { email });
			await Swal.fire({
				icon: 'success',
				title: t("forgotPassword.successTitle"),
				text: t("forgotPassword.successMessage"),
				confirmButtonText: t("forgotPassword.confirmButton")
			});
			onToggleForm(); // Optional: back to login
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: t("forgotPassword.errorTitle"),
				text: t("forgotPassword.errorMessage"),
				confirmButtonText: t("forgotPassword.confirmButton")
			});
		}
	};

	return (
		<div className="forgot-password-container">
			<h2 className="forgot-password-title">{t("forgotPassword.title")}</h2>
			<form className="forgot-password-form" onSubmit={handleSubmit}>
				<div className="input-group">
					<label>{t("forgotPassword.emailLabel")}</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder={t("forgotPassword.emailPlaceholder")}
						required
					/>
				</div>
				<button type="submit" className="submit-button">
					{t("forgotPassword.submitButton")}
				</button>
				<div className="forgot-password-buttons">
					<button
						type="button"
						className="secondary-button"
						onClick={onToggleForm}
					>
						{t("forgotPassword.backToLogin")}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ForgotPassword;
