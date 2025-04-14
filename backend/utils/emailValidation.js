const { body } = require('express-validator');

exports.contactFormValidation = [
	body('firstName')
		.trim()
		.escape()
		.notEmpty().withMessage('First name is required'),

	body('lastName')
		.trim()
		.escape()
		.notEmpty().withMessage('Last name is required'),

	body('email')
		.trim()
		.normalizeEmail()
		.isEmail().withMessage('Valid email is required'),

	body('message')
		.trim()
		.escape()
		.notEmpty().withMessage('Message is required')
		.isLength({ max: 1000 }).withMessage('Message too long'),
];

exports.paymentConfirmationValidation = [
	body('email')
		.trim()
		.normalizeEmail()
		.isEmail().withMessage('Valid email is required'),
];
