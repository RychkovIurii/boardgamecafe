const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
    },
    table: {
        type: Number,
        required: [true, 'Table number is required'],
        min: [1, 'Table number must be at least 1'],
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game', // References the Game model
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
