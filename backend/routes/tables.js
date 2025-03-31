const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const {
	tableValidation,
	tableIdValidation
} = require('../utils/tableValidation');
const validateInputs = require('../middleware/validateInputs');

// Get all tables
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find().sort({ number: 1 });
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new table
router.post('/', authenticate, authorizeAdmin, tableValidation, validateInputs, async (req, res) => {
    const { number, capacity, location, availability } = req.body;
    try {
        const newTable = new Table({ number, capacity, location, availability });
        const savedTable = await newTable.save();
        res.status(201).json(savedTable);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// Update an existing table
router.put('/:id', authenticate, authorizeAdmin, [...tableIdValidation, ...tableValidation], validateInputs, async (req, res) => {
    const { number, capacity, location, availability } = req.body;
    try {
        const updatedTable = await Table.findByIdAndUpdate(
            req.params.id,
            { number, capacity, location, availability },
            { new: true }
        );
        if (!updatedTable) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.json(updatedTable);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// Delete a table
router.delete('/:id', authenticate, authorizeAdmin, tableIdValidation, validateInputs, async (req, res) => {
    try {
        const deletedTable = await Table.findByIdAndDelete(req.params.id);
        if (!deletedTable) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.json({ message: 'Table deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
