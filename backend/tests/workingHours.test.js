const { isWithinWorkingHours } = require('../utils/workingHours');
const moment = require('moment-timezone');

describe('isWithinWorkingHours', () => {
    test('allows booking within working hours', () => {
        const startTime = moment.tz("2025-02-07 18:00", "Europe/Helsinki");
        const endTime = startTime.clone().add(60, 'minutes');

        expect(isWithinWorkingHours(5, startTime, endTime)).toBe(true);
    });

    test('rejects booking before opening time', () => {
        const startTime = moment.tz("2025-02-07 07:00", "Europe/Helsinki");
        const endTime = startTime.clone().add(60, 'minutes');

        expect(isWithinWorkingHours(5, startTime, endTime)).toBe(false);
    });

    test('rejects booking after closing time', () => {
        const startTime = moment.tz("2025-02-07 02:30", "Europe/Helsinki");
        const endTime = startTime.clone().add(60, 'minutes');

        expect(isWithinWorkingHours(5, startTime, endTime)).toBe(false);
    });

	test('rejects booking on a closed day', () => {
		const startTime = moment.tz("2025-02-09 18:00", "Europe/Helsinki");
		const endTime = startTime.clone().add(60, 'minutes');

		expect(isWithinWorkingHours(0, startTime, endTime)).toBe(false);
	});
});
