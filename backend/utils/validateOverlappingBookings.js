const Booking = require('../models/Booking');
const moment = require('moment');

/**
 * Checks if a new booking overlaps with existing bookings for the same table.
 * @param {string} tableId - The table being booked.
 * @param {Date} startDateTime - The start time of the new booking.
 * @param {Date} endDateTime - The end time of the new booking.
 * @param {string} [excludeBookingId] - Booking ID to exclude (used for updating).
 * @returns {Promise<boolean>} - Returns true if an overlap is found, otherwise false.
 */
const validateOverlappingBookings = async (tableId, startDateTime, endDateTime, excludeBookingId = null) => {
    const query = {
        tableId,
        $or: [
            // Case 1: Existing booking starts within the new booking period
            { 
                startTime: { $lt: endDateTime, $gte: startDateTime } 
            },

            // Case 2: Existing booking ends within the new booking period
            { 
                endTime: { $gt: startDateTime, $lte: endDateTime } 
            },

            // Case 3: Existing booking completely overlaps the new booking
            { 
                startTime: { $lte: startDateTime }, 
                endTime: { $gte: endDateTime } 
            }
        ]
    };

    // If updating a booking, exclude the current booking from the check
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const overlappingBookings = await Booking.find(query);
	console.log(overlappingBookings);
    return overlappingBookings.length > 0;
};

module.exports = { validateOverlappingBookings };
