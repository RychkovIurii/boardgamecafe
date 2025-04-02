const { body, param } = require('express-validator');
const mongoose = require('mongoose');

exports.updateBookingValidation = [
	param('id')
		.custom(value => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid booking ID'),

	body('date')
		.trim()
		.notEmpty().withMessage('Date is required')
		.isISO8601().withMessage('Date must be valid'),

	body('startTime')
		.notEmpty().withMessage('Start time is required')
		.matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:mm format'),

	body('duration')
		.notEmpty().withMessage('Duration is required')
		.isInt({ min: 30, max: 360 }).withMessage('Invalid duration'),

	body('tableId')
		.notEmpty().withMessage('Table is required')
		.custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid table ID'),

	body('players')
		.notEmpty().withMessage('Player count is required')
		.isInt({ min: 1, max: 10 }),

	body('game')
		.optional()
		.trim()
		.escape()
		.isLength({ max: 100 }),

	body('contactName')
		.trim()
		.escape()
		.notEmpty().withMessage('Name is required')
		.isLength({ max: 50 }),

	body('contactPhone')
		.trim()
		.notEmpty().withMessage('Phone is required')
		.isMobilePhone().withMessage('Invalid phone number'),
];
