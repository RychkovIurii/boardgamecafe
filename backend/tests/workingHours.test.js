jest.mock('../models/WorkingHours', () => ({
    WorkingHours: { find: jest.fn() },
    SpecialHours: { findOne: jest.fn() },
}));

const { isWithinWorkingHours } = require('../utils/workingHours');
const { WorkingHours, SpecialHours } = require('../models/WorkingHours');
const moment = require('moment-timezone');

const mockWorkingHours = [
    { day: 'Monday', openTime: '10:00', closeTime: '23:30' },
    { day: 'Tuesday', openTime: '10:00', closeTime: '23:30' },
    { day: 'Wednesday', openTime: '10:00', closeTime: '23:30' },
    { day: 'Thursday', openTime: '10:00', closeTime: '23:30' },
    { day: 'Friday', openTime: '10:00', closeTime: '23:30' },
    { day: 'Saturday', openTime: '10:00', closeTime: '23:30' },
    { day: 'Sunday', openTime: null, closeTime: null },
];

describe('isWithinWorkingHours', () => {
	beforeEach(() => {
        WorkingHours.find.mockResolvedValue(mockWorkingHours);
        SpecialHours.findOne.mockResolvedValue(null);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
	
    test('allows booking within working hours', async () => {
        const bookingDate = moment.tz('2025-03-21', 'Europe/Helsinki');
        const startTime = moment.tz('2025-03-21 18:00', 'Europe/Helsinki');
        const endTime = startTime.clone().add(60, 'minutes');

        const result = await isWithinWorkingHours(bookingDate, bookingDate.day(), startTime, endTime);
        expect(result).toEqual({ valid: true });
    });

    test('rejects booking before opening time', async () => {
        const bookingDate = moment.tz('2025-03-21', 'Europe/Helsinki');
        const startTime = moment.tz('2025-03-21 07:00', 'Europe/Helsinki');
        const endTime = startTime.clone().add(60, 'minutes');

        const result = await isWithinWorkingHours(bookingDate, bookingDate.day(), startTime, endTime);
        expect(result).toEqual({
            valid: false,
            message: 'Booking must be between 10:00 and 23:30 on Friday.',
        });
    });

    test('rejects booking after closing time', async () => {
        const bookingDate = moment.tz('2025-03-21', 'Europe/Helsinki');
        const startTime = moment.tz('2025-03-21 23:00', 'Europe/Helsinki');
        const endTime = startTime.clone().add(90, 'minutes');

        const result = await isWithinWorkingHours(bookingDate, bookingDate.day(), startTime, endTime);
        expect(result).toEqual({
            valid: false,
            message: 'Booking must be between 10:00 and 23:30 on Friday.',
        });
    });

   test('rejects booking on a closed day', async () => {
        const bookingDate = moment.tz('2025-03-23', 'Europe/Helsinki');
        const startTime = moment.tz('2025-03-23 18:00', 'Europe/Helsinki');
        const endTime = startTime.clone().add(60, 'minutes');

        const result = await isWithinWorkingHours(bookingDate, bookingDate.day(), startTime, endTime);
        expect(result).toEqual({
            valid: false,
            message: 'Sunday is closed.',
        });
    });

    test('prefers special hours when available', async () => {
        const bookingDate = moment.tz('2025-12-24', 'Europe/Helsinki');
        const startTime = moment.tz('2025-12-24 12:00', 'Europe/Helsinki');
        const endTime = startTime.clone().add(60, 'minutes');
        SpecialHours.findOne.mockResolvedValueOnce({ openTime: '14:00', closeTime: '18:00', reason: 'Christmas Eve' });

        const result = await isWithinWorkingHours(bookingDate, bookingDate.day(), startTime, endTime);
        expect(result).toEqual({
            valid: false,
            message: 'Booking must be between 14:00 and 18:00 on Wednesday.',
        });
    });
});
