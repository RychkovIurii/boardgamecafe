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
    minPlayers: {
        type: Number,
        required: [true, 'Minimum number of players is required'],
        min: [1, 'Minimum number of players must be at least 1'],
    },
    maxPlayers: {
        type: Number,
        required: [true, 'Maximum number of players is required'],
        min: [1, 'Maximum number of players must be at least 1'],
    },
    availability: {
        type: Boolean,
        default: true, // Indicates if the game is currently available
    },
    copies: {
        type: Number,
        required: true,
        min: [1, 'There must be at least one copy of the game'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Game', gameSchema);
