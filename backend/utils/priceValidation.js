const { body, param } = require('express-validator');
const mongoose = require('mongoose');

exports.menuItemValidation = [
	body('menuType')
		.trim()
		.escape()
		.notEmpty().withMessage('Menu type is required')
		.isLength({ max: 50 }),

	body('image')
		.optional()
		.trim()
		.escape()
		.isString()
		.isLength({ max: 300 }),

	body('details')
		.optional()
		.trim()
		.escape()
		.isLength({ max: 1000 }),
];

exports.menuItemIdValidation = [
	param('id')
		.custom(value => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid menu item ID'),
];
