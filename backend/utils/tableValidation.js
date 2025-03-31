const { body, param } = require('express-validator');
const mongoose = require('mongoose');

exports.tableValidation = [
	body('number')
		.notEmpty().withMessage('Table number is required')
		.isInt({ min: 1, max: 50 }).withMessage('Table number must be between 1 and 50'),

	body('capacity')
		.notEmpty().withMessage('Capacity is required')
		.isInt({ min: 1, max: 20 }).withMessage('Capacity must be between 1 and 20'),

	body('location')
		.optional()
		.trim()
		.escape()
		.isLength({ max: 100 }).withMessage('Location too long'),

	body('availability')
		.isBoolean().withMessage('Availability must be true or false'),
];

exports.tableIdValidation = [
	param('id')
		.custom(id => mongoose.Types.ObjectId.isValid(id))
		.withMessage('Invalid table ID'),
];
