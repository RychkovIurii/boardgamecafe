const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { authenticate } = require('../middleware/auth');
const { validateBooking } = require('../utils/bookingValidation');
const { validateOverlappingBookings } = require('../utils/validateOverlappingBookings');




// Fetch available tables. FOR ALL USERS
router.get('/available', async (req, res) => { //need to fix
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
    let { date, startTime, duration, tableNumber, players, gameId, userId, contactName, contactPhone, amount, paymentMethod } = req.body;

	// Validate booking details
	const validationResult = validateBooking(date, startTime, duration);
    if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.message });
    }

	if (!tableNumber || tableNumber < 1 || tableNumber > 26) {
        return res.status(400).json({ message: 'Invalid table number' });
    }
	const table = await Table.findOne({ number: tableNumber });
    if (!table) {
        return res.status(400).json({ message: 'Table not found' });
    }
    const tableId = table._id;

    const { startHelsinkiTime, endHelsinkiTime } = validationResult;
	const startUTCtime = startHelsinkiTime.toDate();
	const endUTCtime = endHelsinkiTime.toDate();


    // Check for overlapping bookings
    const hasOverlap = await validateOverlappingBookings(tableId, startUTCtime, endUTCtime);
    if (hasOverlap) {
        return res.status(400).json({ message: 'Requested booking time is not available.' });
    }

    try {
        const newBooking = new Booking({
            date: startUTCtime,
			startTime: startUTCtime,
			endTime: endUTCtime,
            tableId,
            players,
            gameId,
            userId,
            contactName,
            contactPhone
        });

        const savedBooking = await newBooking.save();
		let savedPayment = null;
		if (amount && paymentMethod) { // ✅ Only create payment if details are provided
			const newPayment = new Payment({
				bookingId: savedBooking._id,
				amount,
				status: 'pending',
				paymentMethod,
			});
			savedPayment = await newPayment.save();
		}

		// ✅ Only assign `paymentId` if a payment was created
		if (savedPayment) {
			savedBooking.paymentId = savedPayment._id;
			await savedBooking.save();
		}
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
    const { date, startTime, duration, tableId, players, gameId, contactName, contactPhone } = req.body;

    const validationResult = validateBooking(date, startTime, duration);
    if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.message });
    }

	const { startDateTime, endDateTime } = validationResult;

    // Check if the requested booking time is available (excluding the current booking)
    const hasOverlap = await validateOverlappingBookings(tableId, startDateTime, endDateTime, req.params.id);
    if (hasOverlap) {
        return res.status(400).json({ message: 'Requested booking time is not available.' });
    }

    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this booking' });
        }

        booking.date = startDateTime.toDate();
		booking.startTime = startDateTime.toDate();
		booking.endTime = endDateTime.toDate();
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

