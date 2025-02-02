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

const isWithinWorkingHours = (day, startTime, endTime, date) => {
    const workingHours = getWorkingHours();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[day];

    const hours = workingHours[dayName];

    if (!hours || hours.start === 'CLOSED' || hours.end === 'CLOSED') {
        return false;
    }

    const workingStart = convertToHelsinkiTime(date, hours.start);
	console.log('Working Start:', workingStart.format());
    let workingEnd = convertToHelsinkiTime(date, hours.end);
    workingEnd = adjustEndTimeIfNeeded(workingStart, workingEnd);
	console.log('Working End:', workingEnd.format());

    const bookingStart = convertToHelsinkiTime(date, startTime);
    let bookingEnd = convertToHelsinkiTime(date, endTime);
    bookingEnd = adjustEndTimeIfNeeded(bookingStart, bookingEnd);

    console.log('Working Hours:', hours);
    console.log('Booking Start:', bookingStart.format());
    console.log('Booking End:', bookingEnd.format());

    if (bookingStart.isBefore(workingStart) || bookingEnd.isAfter(workingEnd)) {
        console.log('Booking time is outside working hours');
        return false;
    }

    if (bookingStart.minute() % 30 !== 0 || bookingEnd.minute() % 30 !== 0) {
        console.log('Booking time is not in 30-minute intervals');
        return false;
    }

    const duration = bookingEnd.diff(bookingStart, 'minutes');
    if (duration < 60 || duration % 30 !== 0) {
        console.log('Booking duration is less than one hour or not in 30-minute intervals');
        return false;
    }

    return true;
};

module.exports = { isWithinWorkingHours };
