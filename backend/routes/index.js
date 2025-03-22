//Aggregate all routes in one file

const express = require('express');
const router = express.Router();

// Import all routes
const bookingRoutes = require('./bookings');
const userRoutes = require('./users');
const adminRoutes = require('./admin');
const tableRoutes = require('./tables');
const eventRoutes = require('./events');
const pricesRoutes = require('./prices');
const paymentRoutes = require('./payment');
const hoursRoutes = require('./workingHours');
const specialHoursRoutes = require('./specialHours');

// Mount all routes
router.use('/bookings', bookingRoutes);
router.use('/tables', tableRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/events', eventRoutes);
router.use('/prices', pricesRoutes);
router.use('/payment', paymentRoutes);
router.use('/hours', hoursRoutes);
router.use('/specialHours', specialHoursRoutes);

module.exports = router;
