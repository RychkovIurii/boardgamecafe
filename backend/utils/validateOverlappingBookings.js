const Booking = require('../models/Booking');
const moment = require('moment');

/**
 * Checks if a new booking overlaps with existing bookings for the same table.
 * @param {string} tableId - The table being booked.
 * @param {Date} startUTCtime - The start time of the new booking.
 * @param {Date} endUTCtime - The end time of the new booking.
 * @param {string} [excludeBookingId] - Booking ID to exclude (used for updating).
 * @returns {Promise<boolean>} - Returns true if an overlap is found, otherwise false.
 */
const validateOverlappingBookings = async (tableId, startUTCtime, endUTCtime, excludeBookingId = null) => {
    const query = {
        tableId,
        $or: [
            { startTime: { $lt: endUTCtime }, endTime: { $gt: startUTCtime } }
		]
	};

    // If updating a booking, exclude the current booking from the check
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const overlappingBookings = await Booking.find(query);
    return overlappingBookings.length > 0;
};

module.exports = { validateOverlappingBookings };
