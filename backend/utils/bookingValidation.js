const { convertToHelsinkiTime } = require('./timeUtils');
const { isWithinWorkingHours } = require('./workingHours');

/**
 * Validates booking inputs before saving to database.
 * @param {string} date - The booking date.
 * @param {string} startTime - The booking start time (HH:mm).
 * @param {number} duration - The booking duration in minutes.
 * @returns {object} - Object containing validation result and message.
 */
const validateBooking = (date, startTime, duration) => {
    if (!duration || duration < 60 || duration % 30 !== 0) {
        return { isValid: false, message: 'Booking duration must be at least 60 minutes and in 30-minute intervals.' };
    }

    const bookingDate = convertToHelsinkiTime(date, "00:00").startOf('day');
    const day = bookingDate.day();

    const startDateTime = convertToHelsinkiTime(date, startTime);
    const endDateTime = startDateTime.clone().add(duration, 'minutes');

    if (endDateTime.isBefore(startDateTime)) {
        return { isValid: false, message: 'End time must be after start time.' };
    } //I can reove this. We got endDateTime from startDateTime + duration

    const lastShiftTime = convertToHelsinkiTime(date, "23:30");
    if (startDateTime.isAfter(lastShiftTime)) {
        return { isValid: false, message: 'Last booking shift is at 23:30. Please choose an earlier start time.' };
    }

    if (!isWithinWorkingHours(day, startDateTime, endDateTime)) {
        return { isValid: false, message: 'Booking time must be within working hours.' };
    }

    return { isValid: true, startDateTime, endDateTime };
};

module.exports = { validateBooking };
