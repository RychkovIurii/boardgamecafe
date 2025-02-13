const moment = require('moment-timezone');

/**
 * Converts a given date and time into Helsinki timezone.
 * @param {string} date - The booking date (YYYY-MM-DD or ISO format).
 * @param {string} time - The time (HH:mm).
 * @returns {moment.Moment} - The converted Moment.js object in Europe/Helsinki.
 */
const convertToHelsinkiTime = (date, time) => {
    return moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Europe/Helsinki');
};

/**
 * Handles midnight crossover for end time.
 * If endTime is earlier than startTime, it moves to the next day.
 * @param {moment.Moment} startTime - The start time in Helsinki timezone.
 * @param {moment.Moment} endTime - The end time in Helsinki timezone.
 * @returns {moment.Moment} - The adjusted end time.
 */
const adjustEndTimeIfNeeded = (startTime, endTime) => {
    if (endTime.isBefore(startTime)) {
        return endTime.add(1, 'day');
    }
    return endTime;
};

module.exports = { convertToHelsinkiTime, adjustEndTimeIfNeeded };
