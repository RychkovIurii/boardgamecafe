const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// ✅ Public route to fetch all tables
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find().sort({ number: 1 }); // ✅ Sort by table number
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
