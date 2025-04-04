const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../middleware/auth');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        /* res.cookie('accessToken', token, { //For cookie-based authentication. On render we can't.
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
			path: '/',
			maxAge: 3600000
        }); 
		res.status(200).json({ message: 'Login successful', role: user.role });
		*/
		res.status(200).json({ //For token-based authentication.
			message: 'Login successful',
			token,
			role: user.role
		  });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, phone });
        res.status(201).json({
			message: 'User registered successfully',
			user: {
			  name: user.name,
			  email: user.email,
			  phone: user.phone,
			  role: user.role,
			  _id: user._id,
			  createdAt: user.createdAt
			}
		  });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user phone number
const updateUserPhone = async (req, res) => {
    const { phone } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.phone = phone;
        await user.save();

        res.json({ message: 'Phone number updated successfully' });
    } catch (error) {
        console.error('Error updating phone number:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
	loginUser,
	registerUser,
	updateUserPhone
};
