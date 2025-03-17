const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
	try {
		const currentDate = new Date();
		const events = await Event.find({ date: { $gte: currentDate } }).sort({ date: 1 });
		res.json(events);
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

// Create new event (admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      image: req.body.image
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Invalid event data' });
  }
});

module.exports = router;
