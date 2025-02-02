const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { authenticate } = require('../middleware/auth');
const { isWithinWorkingHours } = require('../utils/workingHours');
const { convertToHelsinkiTime, adjustEndTimeIfNeeded } = require('../utils/timeUtils');
const moment = require('moment');

//Think how handle working hours



// Fetch available tables. FOR ALL USERS
router.get('/available', async (req, res) => {
    const { date, startTime, endTime } = req.query;

    try {
        const bookedTables = await Booking.find({
            date,
            $or: [ // Check if booking overlaps with existing bookings
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
                { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
            ]
        }).select('tableId');

        const bookedTableIds = bookedTables.map(booking => booking.tableId);
        const availableTables = await Table.find({ _id: { $nin: bookedTableIds } });

        res.json(availableTables);
    } catch (error) {
        console.error('Error fetching available tables:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new booking. FOR ALL USERS
router.post('/', async (req, res) => {
    let { date, startTime, duration, tableId, players, gameId, userId, contactName, contactPhone } = req.body;

    if (!duration || duration < 60 || duration % 30 !== 0) {
        return res.status(400).json({ message: 'Booking duration must be at least 60 minutes and in 30-minute intervals.' });
    }
	
    const bookingDate = convertToHelsinkiTime(date, "00:00").startOf('day'); // Ensure date is correct
    const day = bookingDate.day();

	const startDateTime = convertToHelsinkiTime(date, startTime);
    const endDateTime = startDateTime.clone().add(duration, 'minutes');

/* 	console.log("Converted Start Time:", startDateTime.format());
    console.log("Converted End Time:", endDateTime.format()); */

	// Ensure endTime is after startTime
	if (endDateTime.isBefore(startDateTime)) {
		return res.status(400).json({ message: 'End time must be after start time.' });
	}

	//Ensure last booking starts at 23:30 or earlier
	const lastShiftTime = convertToHelsinkiTime(date, "23:30");
    if (startDateTime.isAfter(lastShiftTime)) {
        return res.status(400).json({ message: 'Last booking shift is at 23:30. Please choose an earlier start time.' });
    }

    if (!isWithinWorkingHours(day, startDateTime, endDateTime)) {
        return res.status(400).json({ message: 'Booking time must be within working hours.' });
    }

    const overlappingBookings = await Booking.find({
		tableId, // ✅ Ensures conflicts are only checked for the same table
		$or: [
			// Case 1: Existing booking starts within the new booking period
			{ 
				date: bookingDate.toDate(), 
				startTime: { $lt: endDateTime.format('HH:mm'), $gte: startDateTime.format('HH:mm') } 
			},
	
			// Case 2: Existing booking ends within the new booking period
			{ 
				date: bookingDate.toDate(), 
				endTime: { $gt: startDateTime.format('HH:mm'), $lte: endDateTime.format('HH:mm') } 
			},
	
			// Case 3: Existing booking completely overlaps the new booking
			{ 
				date: bookingDate.toDate(), 
				startTime: { $lte: startDateTime.format('HH:mm') }, 
				endTime: { $gte: endDateTime.format('HH:mm') } 
			},
	
			// Case 4: Handle previous day's bookings that span into this day
			{
				date: moment(bookingDate).subtract(1, 'day').toDate(), // Previous day
				startTime: { $lt: endDateTime.format('HH:mm') }, // Started yesterday but overlaps today
				endTime: { $gt: startDateTime.format('HH:mm') }  // Ends after the new start time
			},
	
			// Case 5: Handle next day's bookings that started today and overlap past midnight
			{
				date: moment(bookingDate).add(1, 'day').toDate(), // Next day
				startTime: { $lt: endDateTime.format('HH:mm') }, // Started today but overlaps into next day
				endTime: { $gt: startDateTime.format('HH:mm') }  // Ends after the new start time
			}
		]
	});

    if (overlappingBookings.length > 0) {
        //console.log('Conflicting bookings:', overlappingBookings);
        return res.status(400).json({ message: 'Requested booking time is not available.' });
    }

    try {
        const newBooking = new Booking({
            date: bookingDate.toDate(),
            startTime: startDateTime.format('HH:mm'),
            endTime: endDateTime.format('HH:mm'),
            tableId,
            players,
            gameId,
            userId,
            contactName,
            contactPhone
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch own bookings (Authorized user) ONLY FOR AUTHORIZED USERS
router.get('/my-bookings', authenticate, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('tableId').populate('gameId').populate('userId');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a booking (Authorized user) ONLY FOR AUTHORIZED USERS
router.put('/my-bookings/:id', authenticate, async (req, res) => {
    const { date, startTime, endTime, tableId, players, gameId, contactName, contactPhone } = req.body;

    const bookingDate = new Date(date);
    const day = bookingDate.getDay();

    if (!isWithinWorkingHours(day, startTime, endTime)) {
        return res.status(400).json({ message: 'Booking time must be within working hours and intervals' });
    }

    // Check if the requested booking time is available
    const overlappingBookings = await Booking.find({
        date,
        tableId,
        _id: { $ne: req.params.id }, // Exclude the current booking being updated
        $or: [
            { startTime: { $lt: endTime, $gte: startTime } },
            { endTime: { $gt: startTime, $lte: endTime } },
            { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
        ]
    });

    if (overlappingBookings.length > 0) {
        return res.status(400).json({ message: 'Requested booking time is not available' });
    }

    try {
        const booking = await Booking.findById(req.params.id);

		const bookingDate = new Date(date);
		const day = bookingDate.getDay();

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this booking' });
        }

        booking.date = date;
        booking.startTime = startTime;
        booking.endTime = endTime;
        booking.tableId = tableId;
        booking.players = players;
        booking.gameId = gameId;
        booking.contactName = contactName;
        booking.contactPhone = contactPhone;

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a booking (Authorized user) ONLY FOR AUTHORIZED USERS
router.delete('/my-bookings/:id', authenticate, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
        }

        await booking.remove();
        res.json({ message: 'Booking canceled' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

