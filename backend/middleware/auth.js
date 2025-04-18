const jwt = require('jsonwebtoken');
const User = require('../models/User');

/*
Middleware for Authentication and Authorization.
*/
const authenticate = async (req, res, next) => {

/* 	// For cookie-based authentication
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    } */

	// For token-based authentication
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'No token, authorization denied' });
	}
	const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please refresh' });
        }
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Generate tokens
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Admin Authorization
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin, generateToken };
