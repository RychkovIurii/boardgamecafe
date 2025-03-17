const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Game = require('../models/Game');
const Table = require('../models/Table');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Admin dashboard route
router.get('/dashboard', authenticate, authorizeAdmin, (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard' });
});

// Fetch all upcoming-bookings (Admin view) ONLY FOR ADMIN
router.get('/upcoming-bookings', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const today = new Date();
		console.log('Current Date:', today); // Debugging log

		const upcomingBookings = await Booking.find({ date: { $gte: today } })
			.populate('tableId', 'number')
			.populate('gameId', 'title')
			.populate('userId', 'name email')
			.populate({ path: 'paymentId', select: 'status amount paymentMethod' })
			.sort({ date: 1, startTime: 1 });
		console.log('Debugging Data:', JSON.stringify(upcomingBookings, null, 2));
        res.json(upcomingBookings);
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/tables', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const tables = await Table.find().sort({ number: 1 });
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch all bookings (Admin view) ONLY FOR ADMIN
router.get('/all-bookings', authenticate, authorizeAdmin, async (req, res) => {
	try {
		const bookings = await Booking.find().populate('tableId').populate('gameId').populate('userId');
		res.json(bookings);
	} catch (error) {
		console.error('Error fetching bookings:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.get('/bookings/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('tableId', 'number')
            .populate('gameId', 'title')
            .populate('userId', 'name email phone');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/bookings/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/games', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const games = await Game.find().sort({ title: 1 });
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/bookings/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await Booking.deleteOne({ _id: req.params.id });
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
