const { convertToHelsinkiTime, adjustEndTimeIfNeeded } = require('../utils/timeUtils');
const { WorkingHours, SpecialHours } = require('../models/WorkingHours');
const moment = require('moment-timezone');

const getWorkingHours = async () => {
	try {
		const hoursFromDb = await WorkingHours.find({});
		
		const workingHours = {};

		hoursFromDb.forEach(({ day, openTime, closeTime }) => {
			if (!openTime || !closeTime) {
				workingHours[day] = { start: 'CLOSED', end: 'CLOSED' };
			} else {
				workingHours[day] = { start: openTime, end: closeTime };
			}
		});

		return workingHours;
	} catch (err) {
		console.error('Failed to fetch working hours from DB:', err);
		throw err;
	}
};

/**
 * Checks if a booking time is within working hours.
 * @param {number} day - The day of the week (0 = Sunday, 6 = Saturday).
 * @param {moment.Moment} startTime - The booking start time.
 * @param {moment.Moment} endTime - The booking end time.
 * @returns {boolean} - True if booking is within working hours.
 */
const isWithinWorkingHours = async (date, day, startTime, endTime) => {
    const workingHours = await getWorkingHours();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[day];

	const normalizedDate = new Date(date.clone().startOf('day').format('YYYY-MM-DD'));
	const special = await SpecialHours.findOne({ date: normalizedDate });
	let hours;
	let reason = null;
	if (special) {
		hours = {
			start: special.openTime || 'CLOSED',
			end: special.closeTime || 'CLOSED'
		};
		reason = special.reason;
	} else {
		hours = workingHours[dayName];
	}

    if (!hours || hours.start === 'CLOSED' || hours.end === 'CLOSED') {
		return {
			valid: false,
			message: reason
				? `${dayName} is closed: ${reason}.`
				: `${dayName} is closed.`
		};
    }
	const workingStart = convertToHelsinkiTime(startTime.format('YYYY-MM-DD'), hours.start);
	let workingEnd = convertToHelsinkiTime(startTime.format('YYYY-MM-DD'), hours.end);
	workingEnd = adjustEndTimeIfNeeded(workingStart, workingEnd);

	if (startTime.isBefore(workingStart) || endTime.isAfter(workingEnd)) {
		return {
			valid: false,
			message: `Booking must be between ${hours.start} and ${hours.end} on ${dayName}.`
		};
    }

    return { valid: true };
};

module.exports = { isWithinWorkingHours };
