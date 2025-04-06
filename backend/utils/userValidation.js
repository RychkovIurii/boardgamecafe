const { body } = require('express-validator');

exports.registerValidation = [
	body('name')
		.trim()
		.escape()
		.matches(/^[a-zA-Z0-9 _-]+$/).withMessage('Name contains invalid characters')
		.notEmpty().withMessage('Name is required')
		.isLength({ max: 50 }).withMessage('Name is too long'),

	body('email')
		.trim()
		.normalizeEmail()
		.notEmpty().withMessage('Email is required')
		.isEmail().withMessage('Invalid email'),

	body('password')
		.notEmpty().withMessage('Password is required')
		.isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

	body('phone')
		.trim()
		.notEmpty().withMessage('Phone is required')
		.isMobilePhone('any').withMessage('Invalid phone number'),
];

exports.loginValidation = [
	body('email')
		.trim()
		.normalizeEmail()
		.notEmpty().withMessage('Email is required')
		.isEmail().withMessage('Invalid email format'),

	body('password')
		.notEmpty().withMessage('Password is required')
		.isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
];

exports.updatePhoneValidation = [
	body('phone')
		.trim()
		.notEmpty().withMessage('Phone number is required')
		.isMobilePhone('any').withMessage('Invalid phone number')
];

exports.updateEmailValidation = [
	body('email')
		.trim()
		.normalizeEmail()
		.notEmpty().withMessage('Email is required')
		.isEmail().withMessage('Invalid email format'),
];
