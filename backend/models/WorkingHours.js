const mongoose = require('mongoose');

const workingHoursSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
    },
    openTime: {
        type: String, // Store as HH:mm format
        default: null, // Null if closed
    },
    closeTime: {
        type: String,
        default: null,
    },
});

const specialHoursSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    openTime: { type: String, default: null }, // Special day opening time
    closeTime: { type: String, default: null }, // Special day closing time
    reason: { type: String, required: false }, // e.g., "Christmas"
});

const WorkingHours = mongoose.model('WorkingHours', workingHoursSchema);
const SpecialHours = mongoose.model('SpecialHours', specialHoursSchema);

module.exports = { WorkingHours, SpecialHours };
