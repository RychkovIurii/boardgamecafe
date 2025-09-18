const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Event = require('../models/Event');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const {
    eventCreateValidation,
    eventUpdateValidation
} = require('../utils/eventValidation');
const validateInputs = require('../middleware/validateInputs');

const deleteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});

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

// Get past events (admin only)
router.get('/past', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const currentDate = new Date();
        const events = await Event.find({ date: { $lt: currentDate } }).sort({ date: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new event (admin only)
router.post('/', authenticate, authorizeAdmin, eventCreateValidation, validateInputs, async (req, res) => {
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

// Update existing event (admin only)
router.put('/:id', authenticate, authorizeAdmin, eventUpdateValidation, validateInputs, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                image: req.body.image
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: 'Invalid event data' });
    }

    router.delete('/:id', deleteLimiter, authenticate, authorizeAdmin, eventUpdateValidation, validateInputs, async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            await event.deleteOne({ _id: req.params.id });
            res.json({ message: 'Event deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    })
});

module.exports = router;
