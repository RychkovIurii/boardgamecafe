const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: [true, 'Table number is required'],
        unique: true,
    },
    capacity: {
        type: Number,
        required: [true, 'Table capacity is required'],
        min: [1, 'Table capacity must be at least 1'],
    },
    location: {
        type: String,
        required: [true, 'Table location is required'],
        trim: true,
    },
    availability: {
        type: Boolean,
        default: true, // Indicates if the table is currently available
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Table', tableSchema);
