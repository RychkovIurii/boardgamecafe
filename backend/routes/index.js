//Aggregate all routes in one file

const express = require('express');
const router = express.Router();
const bookingRoutes = require('./bookings');

// Mount the booking routes
router.use('/bookings', bookingRoutes);

module.exports = router;
