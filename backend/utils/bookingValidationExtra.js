const { query } = require('express-validator');
const { param } = require('express-validator');
const mongoose = require('mongoose');

exports.suggestedTablesValidation = [
	query('date')
		.trim()
		.notEmpty().withMessage('Date is required')
		.isISO8601().withMessage('Date must be a valid ISO8601 date'),

	query('startTime')
		.trim()
		.notEmpty().withMessage('Start time is required')
		.matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:mm format'),

	query('duration')
		.trim()
		.notEmpty().withMessage('Duration is required')
		.isInt({ min: 60, max: 600 }).withMessage('Duration must be between 60 and 600 minutes'),
];

exports.deleteBookingValidation = [
	param('id')
		.custom(value => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid booking ID'),
];
