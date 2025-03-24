import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useTranslation } from 'react-i18next';
import './Style/RegisterStyles.css';
import Swal from 'sweetalert2';

const Register = ({ onToggleForm }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		password: ''
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => { // We need do phone validation!
		e.preventDefault();
		try {
			const response = await API.post('/users/register', formData);
			await Swal.fire({
				icon: 'success',
				title: t("register.successTitle"),
				text: t("register.successMessage"),
				confirmButtonText: t("register.confirmButton")
			});
			navigate('/sign-in');
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: t("register.errorTitle"),
				text: t("register.errorMessage"),
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
