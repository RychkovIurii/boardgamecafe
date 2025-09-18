const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const eventCreateValidation = [
	body('title')
		.trim()
		.escape()
		.notEmpty().withMessage('Title is required')
		.isLength({ max: 100 }).withMessage('Title is too long'),

	body('description')
		.optional()
		.trim()
		.escape()
		.isLength({ max: 1000 }),

	body('date')
		.notEmpty().withMessage('Date is required')
		.isISO8601().withMessage('Invalid date format'),

	body('image')
		.optional()
		.trim()
		.isURL({ protocols: ['http','https'], require_protocol: true })
		.withMessage('Image must be a valid URL')
		.isLength({ max: 300 })
];

const eventIdValidation = [
	param('id')
		.custom(value => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid event ID')
];

exports.eventCreateValidation = eventCreateValidation;
exports.eventIdValidation = eventIdValidation;
exports.eventUpdateValidation = [
	...eventIdValidation,
	...eventCreateValidation
];
