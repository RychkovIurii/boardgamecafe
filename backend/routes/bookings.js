const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const Payment = require('../models/Payment');
const { authenticate } = require('../middleware/auth');
const { validateBooking } = require('../utils/bookingValidation');
const { validateOverlappingBookings } = require('../utils/validateOverlappingBookings');
const { suggestedTablesValidation } = require('../utils/bookingValidationExtra');
const { deleteBookingValidation } = require('../utils/bookingValidationExtra');
const { createBookingValidation } = require('../utils/bookingValidationPost');
const { updateBookingValidation } = require('../utils/bookingValidationPut');
const validateInputs = require('../middleware/validateInputs');

// Fetch available tables. FOR ALL USERS
router.get('/suggested-tables', suggestedTablesValidation, validateInputs, async (req, res) => {
	const { date, start: startTime, duration } = req.query;
	
	if (!date || !startTime || !duration) {
	  return res.status(400).json({ message: 'Missing required query parameters: date, startTime, endTime' });
	}
	const validationResult = await validateBooking(date, start, duration);
    if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.message });
    }

	const { startTime: startUTC, endTime: endUTC } = validationResult;
  
	try {
	  // Find bookings that overlap with the requested time interval.
	  const bookedTables = await Booking.find({
		date,
		$or: [
		  { startTime: { $lt: endUTC, $gte: startUTC } },
		  { endTime: { $gt: startUTC, $lte: endUTC } },
		  { startTime: { $lte: startUTC }, endTime: { $gte: endUTC } }
		]
	  }).select('tableId');
  
	  const bookedTableIds = bookedTables.map(booking => booking.tableId);
	  const suggestedTables = await Table.find({ _id: { $nin: bookedTableIds } })
      .sort({ number: 1 });
  
	  res.json(suggestedTables);
	} catch (error) {
	  console.error('Error fetching available tables:', error);
	  res.status(500).json({ message: 'Server error' });
	}
});

// Create a new booking. FOR ALL USERS
router.post('/', createBookingValidation, validateInputs, async (req, res) => {
    let { date, startTime, duration, tableNumber, players, game, userId, contactName, contactPhone, amount, paymentMethod } = req.body;

    // Validate booking details
    const validationResult = await validateBooking(date, startTime, duration);
    if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.message });
    }

    if (!tableNumber || tableNumber < 1 || tableNumber > 50) {
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
            game,
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
        const bookings = await Booking.find({ userId: req.user._id }).populate('tableId', 'number capacity location availability').populate('userId');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a booking (Authorized user) ONLY FOR AUTHORIZED USERS
router.put('/my-bookings/:id', authenticate, updateBookingValidation, validateInputs, async (req, res) => {
    const { date, startTime, duration, tableNumber, players, game, contactName, contactPhone } = req.body;

    const validationResult = await validateBooking(date, startTime, duration);
    if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.message });
    }

    const table = await Table.findOne({ number: tableNumber });
    if (!table) {
        return res.status(400).json({ message: 'Table not found' });
    }
    const tableId = table._id;

    const { startHelsinkiTime, endHelsinkiTime } = validationResult;

	const startUTCtime = startHelsinkiTime.toDate();
	const endUTCtime = endHelsinkiTime.toDate();

    // Check if the requested booking time is available (excluding the current booking)
    const hasOverlap = await validateOverlappingBookings(tableId, startUTCtime, endUTCtime, req.params.id);
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

        booking.date = startUTCtime;
        booking.startTime = startUTCtime;
        booking.endTime = endUTCtime;
        booking.tableId = tableId;
        booking.players = players;
        booking.game = game;
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
router.delete('/my-bookings/:id', authenticate, deleteBookingValidation, validateInputs, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
        }

        await booking.deleteOne({ _id: req.params.id });
        res.json({ message: 'Booking canceled' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

