//Aggregate all routes in one file

const express = require('express');
const router = express.Router();

// Import all routes
const bookingRoutes = require('./bookings');
const userRoutes = require('./users');
const adminRoutes = require('./admin');
const tableRoutes = require('./tables');
const eventRoutes = require('./events');

// Mount all routes
router.use('/bookings', bookingRoutes);
router.use('/tables', tableRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/events', eventRoutes);

module.exports = router;
