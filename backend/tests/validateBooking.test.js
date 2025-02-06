const { validateBooking } = require('../utils/bookingValidation');
const moment = require('moment-timezone');

describe('validateBooking', () => {

    test('rejects empty date', () => {
        const date = "";
        const startTime = "18:00";
        const duration = 60;

        const result = validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe("Invalid date format.");
    });

    test('rejects empty start time', () => {
        const date = "2025-03-07";
        const startTime = "";
        const duration = 60;

        const result = validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe("Invalid starttime format. Use HH:mm.");
    });

    test('rejects empty duration', () => {
        const date = "2025-03-07";
        const startTime = "18:00";
        const duration = null;

        const result = validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Booking duration must be at least 60 minutes and in 30-minute intervals.');
    });

    test('rejects duration less than 60 minutes', () => {
        const date = "2025-03-07";
        const startTime = "18:00";
        const duration = 30;

        const result = validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Booking duration must be at least 60 minutes and in 30-minute intervals.');
    });

    test('rejects duration not multiple of 30 minutes', () => {
        const date = "2025-03-07";
        const startTime = "18:00";
        const duration = 45;

        const result = validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Booking duration must be at least 60 minutes and in 30-minute intervals.');
    });

    test('rejects invalid date format', () => {
        const date = "invalid-date";
        const startTime = "18:00";
        const duration = 60;

        const result = validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe("Invalid date format.");
    });

    test('rejects booking in the past', () => {
        const date = moment().subtract(1, 'day').format('YYYY-MM-DD');
        const startTime = "18:00";
        const duration = 60;

        const result = validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe("Booking cannot be in the past.");
    });

    test('rejects booking starting after 23:30', () => {
        const date = "2025-03-07";
        const startTime = "23:35";
        const duration = 60;

        const result = validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Last booking shift is at 23:30. Please choose an earlier start time.');
    });
});
