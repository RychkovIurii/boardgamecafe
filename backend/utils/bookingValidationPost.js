const { body } = require('express-validator');

exports.createBookingValidation = [
	body('date')
		.trim()
		.notEmpty().withMessage('Date is required')
		.isISO8601().withMessage('Date must be a valid date'),

	body('startTime')
		.notEmpty().withMessage('Start time is required')
		.matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:mm format'),

	body('duration')
		.notEmpty().withMessage('Duration is required')
		.isInt({ min: 30, max: 360 }).withMessage('Duration must be between 30 and 360 minutes'),

	body('tableNumber')
		.notEmpty().withMessage('Table number is required')
		.isInt({ min: 1, max: 50 }).withMessage('Table number must be between 1 and 50'),

	body('players')
		.notEmpty().withMessage('Player count is required')
		.isInt({ min: 1, max: 10 }).withMessage('Player count must be between 1 and 10'),

	body('game')
		.optional()
		.trim()
		.escape()
		.isLength({ max: 40 }).withMessage('Game name too long'),

	body('contactName')
		.trim()
		.escape()
		.notEmpty().withMessage('Contact name is required')
		.isLength({ max: 50 }).withMessage('Name too long'),

	body('contactPhone')
		.trim()
		.notEmpty().withMessage('Phone is required')
		.isMobilePhone().withMessage('Invalid phone number'),

	body('paymentMethod')
		.optional()
		.isIn(['card', 'bancontact', 'eps', 'klarna']).withMessage('Invalid payment method'),

	body('amount')
		.optional()
		.isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
];
