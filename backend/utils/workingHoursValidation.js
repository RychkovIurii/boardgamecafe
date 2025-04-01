const { body } = require('express-validator');
const { param } = require('express-validator');
const mongoose = require('mongoose');

const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

exports.workingHoursCreateValidation = [
	body('day')
		.trim()
		.notEmpty().withMessage('Day is required')
		.isIn(validDays).withMessage('Invalid day name'),

	body('openTime')
		.trim()
		.custom((value) => {
			if (value === '') return true; // Allow empty string = closed
			return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Otherwise must be HH:mm
		}).withMessage('Invalid openTime format (HH:mm or empty)'),

	body('closeTime')
		.trim()
		.custom((value) => {
			if (value === '') return true;
			return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
		}).withMessage('Invalid closeTime format (HH:mm or empty)')
];

exports.workingHoursUpdateValidation = [
	body('day')
		.optional()
		.trim()
		.isIn(validDays).withMessage('Invalid day name'),

	body('openTime')
		.optional()
		.trim()
		.custom((value) => {
			if (value === '') return true;
			return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
		}).withMessage('Invalid openTime format (HH:mm or empty)'),

	body('closeTime')
		.optional()
		.trim()
		.custom((value) => {
			if (value === '') return true;
			return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
		}).withMessage('Invalid closeTime format (HH:mm or empty)')
];

exports.workingHoursDeleteValidation = [
	param('id')
		.custom(value => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid ID format'),
];
