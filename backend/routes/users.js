const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updateUserPhone } = require('../controllers/usersController');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const { registerValidation } = require('../utils/userValidation');
const { loginValidation } = require('../utils/userValidation');
const { updatePhoneValidation } = require('../utils/userValidation');
const validateInputs = require('../middleware/validateInputs');

// Login route
router.post('/login', loginValidation, validateInputs, loginUser);

// Register route
router.post('/register', registerValidation, validateInputs, registerUser);

// Logout route
router.post('/logout', (req, res) => {
	res.clearCookie('accessToken', {
	  path: '/',
	  sameSite: 'Strict',
	  secure: true,
	  httpOnly: true
	});
	res.json({ message: 'User logged out' });
  });

// Update phone route
router.put('/phone', authenticate, updatePhoneValidation, validateInputs, updateUserPhone);


// Fetch user profile route
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
