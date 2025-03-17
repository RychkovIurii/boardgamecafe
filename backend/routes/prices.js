const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

router.post('/', authenticate, authorizeAdmin, async (req, res) => {
	try {
		const newMenuItem = new MenuItem({
			menuType: req.body.menuType,
			image: req.body.image,
			details: req.body.details
		});

		const menuItem = await newMenuItem.save();
		res.status(201).json(menuItem);
	} catch (error) {
		res.status(400).json({ message: 'Invalid menu item data' });
	}
});

router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
	try {
		const updatedMenuItem = await MenuItem.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true, runValidators: true }
		);
		if (!updatedMenuItem) {
			return res.status(404).json({ message: 'Menu item not found' });
		}
		res.json(updatedMenuItem);
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
	try {
		const menuItem = await MenuItem.findById(req.params.id);
		if (!menuItem) {
			return res.status(404).json({ message: 'Menu item not found' });
		}
		await MenuItem.deleteOne({ _id: req.params.id });
		res.json({ message: 'Menu item deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});
