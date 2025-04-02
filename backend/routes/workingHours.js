const express = require('express');
const router = express.Router();
const { WorkingHours } = require('../models/WorkingHours');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { workingHoursCreateValidation ,
		workingHoursUpdateValidation ,
		workingHoursDeleteValidation } = require('../utils/workingHoursValidation');
const validateInputs = require('../middleware/validateInputs');

// Get all working hours
router.get('/', async (req, res) => {
  try {
    const hours = await WorkingHours.find().sort({ 
      day: 1 // You can sort by day name if needed (custom logic might be better)
    });
    res.json(hours);
  } catch (error) {
    console.error('Error fetching working hours:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new working hour entry
router.post('/', authenticate, authorizeAdmin, workingHoursCreateValidation, validateInputs, async (req, res) => {
  const { day, openTime, closeTime } = req.body;
  try {
    const exists = await WorkingHours.findOne({ day });
    if (exists) {
      return res.status(400).json({ message: 'This day already exists. Please update instead.' });
    }
    const newEntry = new WorkingHours({ day, openTime, closeTime });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error saving working hours:', error);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update working hours by ID
router.put('/:id', authenticate, authorizeAdmin, workingHoursUpdateValidation, validateInputs, async (req, res) => {
  const { day, openTime, closeTime } = req.body;
  try {
    const updated = await WorkingHours.findByIdAndUpdate(
      req.params.id,
      { day, openTime, closeTime },
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

// Delete working hours entry
router.delete('/:id', authenticate, authorizeAdmin, workingHoursDeleteValidation, validateInputs, async (req, res) => {
  try {
    const deleted = await WorkingHours.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Working hours entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
