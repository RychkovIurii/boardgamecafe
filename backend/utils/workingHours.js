const fs = require('fs');
const path = require('path');
const { convertToHelsinkiTime, adjustEndTimeIfNeeded } = require('../utils/timeUtils');

const WORKING_HOURS_FILE = path.join(__dirname, '../workingHours.txt');

const parseWorkingHours = (data) => {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const workingHours = {};

    lines.forEach(line => {
        const [day, hours] = line.split(': ');
        if (hours === 'Closed') {
            workingHours[day] = { start: 'CLOSED', end: 'CLOSED' };
        } else {
            const [start, end] = hours.split('-');
            workingHours[day] = { start, end };
        }
    });

    return workingHours;
};

const getWorkingHours = () => {
    const data = fs.readFileSync(WORKING_HOURS_FILE, 'utf-8');
    return parseWorkingHours(data);
};

/**
 * Checks if a booking time is within working hours.
 * @param {number} day - The day of the week (0 = Sunday, 6 = Saturday).
 * @param {moment.Moment} startTime - The booking start time.
 * @param {moment.Moment} endTime - The booking end time.
 * @returns {boolean} - True if booking is within working hours.
 */
const isWithinWorkingHours = (day, startTime, endTime) => {
    const workingHours = getWorkingHours();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[day];

    const hours = workingHours[dayName];

    if (!hours || hours.start === 'CLOSED' || hours.end === 'CLOSED') {
		console.log(`${dayName} is closed!`);
        return false;
    }

    const workingStart = convertToHelsinkiTime(startTime.format('YYYY-MM-DD'), hours.start);
    let workingEnd = convertToHelsinkiTime(startTime.format('YYYY-MM-DD'), hours.end);
    workingEnd = adjustEndTimeIfNeeded(workingStart, workingEnd);

    if (startTime.isBefore(workingStart) || endTime.isAfter(workingEnd)) {
        console.log('Booking time is outside working hours');
        return false;
    }

    return true;
};

module.exports = { isWithinWorkingHours };
