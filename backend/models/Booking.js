const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date is required'],
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required'],
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required'],
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table', // References the Table model
        required: [true, 'Table is required'],
    },
    players: {
        type: Number,
        required: [true, 'Number of players is required'],
        min: [1, 'Number of players must be at least 1'],
    },
    game: {
		type: String,
		required: false,
		trim: true,
	},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: false, // Optional for unauthorized users
    },
    contactName: {
        type: String,
        required: function() { return !this.userId; }, // Required if userId is not provided
        trim: true,
    },
    contactPhone: {
        type: String,
        required: function() { return !this.userId; }, // Required if userId is not provided
        trim: true,
    },
	paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
		required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
