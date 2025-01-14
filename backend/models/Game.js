const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Game title is required'],
        trim: true,
    },
    genre: {
        type: String,
        trim: true,
    },
    players: {
        type: Number,
        min: [1, 'Number of players must be at least 1'],
    },
    availability: {
        type: Boolean,
        default: true, // Indicates if the game is currently available
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Game', gameSchema);
