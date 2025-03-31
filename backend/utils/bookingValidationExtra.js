const { query } = require('express-validator');

exports.suggestedTablesValidation = [
	query('date')
		.trim()
		.notEmpty().withMessage('Date is required')
		.isISO8601().withMessage('Date must be a valid ISO8601 date'),

	query('start')
		.trim()
		.notEmpty().withMessage('Start time is required')
		.matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:mm format'),

	query('duration')
		.trim()
		.notEmpty().withMessage('Duration is required')
		.isInt({ min: 1, max: 240 }).withMessage('Duration must be between 1 and 240 minutes'),
];
