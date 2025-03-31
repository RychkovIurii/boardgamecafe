const { body, param } = require('express-validator');
const mongoose = require('mongoose');

exports.specialHoursValidation = [
	body('date')
		.trim()
		.notEmpty().withMessage('Date is required')
		.isISO8601().withMessage('Date must be a valid ISO date'),

	body('openTime')
		.trim()
		.custom((value) => value === '' || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value))
		.withMessage('Invalid openTime format (HH:mm or empty)'),

	body('closeTime')
		.trim()
		.custom((value) => value === '' || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value))
		.withMessage('Invalid closeTime format (HH:mm or empty)'),

	body('reason')
		.optional()
		.trim()
		.escape()
		.isLength({ max: 200 }).withMessage('Reason too long'),
];

exports.specialHoursIdValidation = [
	param('id')
		.custom(value => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid ID format'),
];
