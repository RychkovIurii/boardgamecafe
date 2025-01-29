const fs = require('fs');
const path = require('path');

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

const isWithinWorkingHours = (day, startTime, endTime) => {
    const workingHours = getWorkingHours();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[day];

    const hours = workingHours[dayName];

    if (hours.start === 'CLOSED' || hours.end === 'CLOSED') {
        return false;
    }

    const [startHour, startMinute] = hours.start.split(':').map(Number);
    const [endHour, endMinute] = hours.end.split(':').map(Number);

    const [bookingStartHour, bookingStartMinute] = startTime.split(':').map(Number);
    const [bookingEndHour, bookingEndMinute] = endTime.split(':').map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    const bookingStart = new Date();
    bookingStart.setHours(bookingStartHour, bookingStartMinute, 0, 0);

    const bookingEnd = new Date();
    bookingEnd.setHours(bookingEndHour, bookingEndMinute, 0, 0);

    // Check if booking times are within working hours
    if (bookingStart < start || bookingEnd > end) {
        return false;
    }

    // Check if booking times are in 30-minute intervals
    if (bookingStartMinute % 30 !== 0 || bookingEndMinute % 30 !== 0) {
        return false;
    }

    // Check if booking duration is at least one hour
    const duration = (bookingEnd - bookingStart) / (1000 * 60); // Duration in minutes
    if (duration < 60 || duration % 30 !== 0) {
        return false;
    }

    return true;
};

module.exports = { isWithinWorkingHours };
