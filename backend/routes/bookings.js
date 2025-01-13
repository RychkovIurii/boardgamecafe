const express = require('express');
const router = express.Router();

// Example route for fetching bookings
router.get('/', (req, res) => {
    res.send('Get all bookings');
});

// Example route for creating a booking
router.post('/', (req, res) => {
    const { name, date, table } = req.body;
    res.send(`Booking created for ${name} on ${date} at table ${table}`);
});

module.exports = router;

