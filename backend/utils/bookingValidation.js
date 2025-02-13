const { convertToHelsinkiTime } = require('./timeUtils');
const { isWithinWorkingHours } = require('./workingHours');
const moment = require('moment-timezone');

/**
 * Validates booking inputs before saving to database.
 * @param {string} date - The booking date.
 * @param {string} startTime - The booking start time (HH:mm).
 * @param {number} duration - The booking duration in minutes.
 * @returns {object} - Object containing validation result and message.
 */
const validateBooking = (date, startTime, duration) => {
    if (!duration || /*typeof duration !== 'number'|| */duration < 60 || duration % 30 !== 0) {
        return { isValid: false, message: 'Booking duration must be at least 60 minutes and in 30-minute intervals.' };
    }

	// Set Helsinki timezone
	const timezone = "Europe/Helsinki";
	const now = moment().tz(timezone);

    const bookingDate = convertToHelsinkiTime(date, "00:00").startOf('day');
	if (!bookingDate.isValid()) {
		return { isValid: false, message: "Invalid date format." };
	}

	// Validate startTime format with regex
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // Matches "HH:mm" format only
    if (!timeRegex.test(startTime)) {
        return { isValid: false, message: "Invalid starttime format. Use HH:mm." };
    }
	
    const day = bookingDate.day();

    const startHelsinkiTime = convertToHelsinkiTime(date, startTime);
	if (!startHelsinkiTime.isValid()) {
		return { isValid: false, message: "Invalid starttime format. Use HH:mm." };
	}

	// Check if the booking is in the past
	if (startHelsinkiTime.isBefore(now)) {
		return { isValid: false, message: "Booking cannot be in the past." };
	}

    const endHelsinkiTime = startHelsinkiTime.clone().add(duration, 'minutes');

    const lastShiftTime = convertToHelsinkiTime(date, "23:30");
    if (startHelsinkiTime.isAfter(lastShiftTime)) {
        return { isValid: false, message: 'Last booking shift is at 23:30. Please choose an earlier start time.' };
    }

    if (!isWithinWorkingHours(day, startHelsinkiTime, endHelsinkiTime)) {
        return { isValid: false, message: 'Booking time must be within working hours.' };
    }

    return { isValid: true, startHelsinkiTime, endHelsinkiTime };
};

module.exports = { validateBooking };
