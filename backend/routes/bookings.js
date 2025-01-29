const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { isWithinWorkingHours } = require('../utils/workingHours');

//Think how handle working hours

// Fetch all bookings (Admin view) ONLY FOR ADMIN
router.get('/all', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('tableId').populate('gameId').populate('userId');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

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
    const { date, startTime, endTime, tableId, players, gameId, userId, contactName, contactPhone } = req.body;

	const bookingDate = new Date(date);
    const day = bookingDate.getDay();

    if (!isWithinWorkingHours(day, startTime, endTime)) {
        return res.status(400).json({ message: 'Booking time must be within working hours and intervals' });
    }

    // Check if the requested booking time is available
    const overlappingBookings = await Booking.find({
        date,
        tableId,
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
        const newBooking = new Booking({
            date,
            startTime,
            endTime,
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

