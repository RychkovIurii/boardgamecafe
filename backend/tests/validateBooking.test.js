jest.mock('../utils/workingHours', () => ({
    isWithinWorkingHours: jest.fn(),
}));

const { validateBooking } = require('../utils/bookingValidation');
const { isWithinWorkingHours } = require('../utils/workingHours');
const moment = require('moment-timezone');

describe('validateBooking', () => {
    beforeEach(() => {
        isWithinWorkingHours.mockResolvedValue({ valid: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('rejects empty start time', async () => {
        const date = "2030-03-21";
        const startTime = "";
        const duration = 60;

        const result = await validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe("Invalid starttime format. Use HH:mm.");
    });

    test('rejects empty duration', async () => {
        const date = "2030-03-21";
        const startTime = "18:00";
        const duration = null;

        const result = await validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Booking duration must be at least 60 minutes and in 30-minute intervals.');
    });

    test('rejects duration less than 60 minutes', async () => {
        const date = "2030-03-21";
        const startTime = "18:00";
        const duration = 30;

        const result = await validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Booking duration must be at least 60 minutes and in 30-minute intervals.');
    });

    test('rejects duration not multiple of 30 minutes', async () => {
        const date = "2030-03-21";
        const startTime = "18:00";
        const duration = 45;

        const result = await validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Booking duration must be at least 60 minutes and in 30-minute intervals.');
    });

    test('rejects invalid date format', async () => {
        const date = "invalid-date";
        const startTime = "18:00";
        const duration = 60;

        const result = await validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe("Invalid date format.");
    });

    test('rejects booking in the past', async () => {
        const date = moment().subtract(1, 'day').format('YYYY-MM-DD');
        const startTime = "18:00";
        const duration = 60;

        const result = await validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe("Booking cannot be in the past.");
    });

    test('rejects booking starting at invalid minute increments', async () => {
        const date = "2030-03-21";
        const startTime = "23:35";
        const duration = 60;

        const result = await validateBooking(date, startTime, duration);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Start time must be on the hour or half-hour (e.g. 14:00 or 14:30).');
    });

    test('rejects booking outside working hours', async () => {
        const date = "2030-03-21";
        const startTime = "18:00";
        const duration = 60;

        isWithinWorkingHours.mockResolvedValueOnce({ valid: false, message: 'Booking must be between 10:00 and 23:30 on Friday.' });

        const result = await validateBooking(date, startTime, duration);
        expect(isWithinWorkingHours).toHaveBeenCalled();
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Booking must be between 10:00 and 23:30 on Friday.');
    });
});
