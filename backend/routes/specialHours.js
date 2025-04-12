const express = require('express');
const router = express.Router();
const { SpecialHours } = require('../models/WorkingHours');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const {
  specialHoursValidation,
  specialHoursIdValidation
} = require('../utils/specialHoursValidation');
const validateInputs = require('../middleware/validateInputs');

// Get all special hours (sorted by date)
router.get('/', async (req, res) => {
  try {
    const hours = await SpecialHours.find().sort({ date: 1 });
    res.json(hours);
  } catch (error) {
    console.error('Error fetching special hours:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new special hours entry
router.post('/', authenticate, authorizeAdmin, specialHoursValidation, validateInputs, async (req, res) => {
  const { date, openTime, closeTime, reason } = req.body;
  try {
    const existing = await SpecialHours.findOne({ date });
    if (existing) {
      return res.status(400).json({ message: 'Special date already exists. Please update instead.' });
    }
    const newEntry = new SpecialHours({ date, openTime, closeTime, reason });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating special hours:', error);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update special hours by ID
router.put('/:id', authenticate, authorizeAdmin, [...specialHoursIdValidation, ...specialHoursValidation], validateInputs, async (req, res) => {
  const { date, openTime, closeTime, reason } = req.body;
  try {
    const updated = await SpecialHours.findByIdAndUpdate(
      req.params.id,
      { date, openTime, closeTime, reason },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Optional: delete a special day entry
router.delete('/:id', authenticate, authorizeAdmin, specialHoursIdValidation, validateInputs, async (req, res) => {
  try {
    const deleted = await SpecialHours.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Special hours entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
