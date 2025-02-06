const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Booking = require('../models/Booking');

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
//        const upcomingBookings = await Booking.find({ date: { $gte: today } })
//            .populate('tableId')
//            .populate('gameId')
//            .populate('userId')
//			.sort({ date: 1, startTime: 1 });

			console.log('Upcoming Bookings:', upcomingBookings); // Debugging log
        res.json(upcomingBookings);
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
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

module.exports = router;
