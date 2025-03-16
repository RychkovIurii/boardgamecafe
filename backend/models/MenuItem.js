const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    menuType: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    details: {
        description: {
            type: String,
            required: false
        },
        pricing: [
            {
                item: {
                    type: String,
                    required: true
                },
                options: {
                    type: [String],
                    required: false
                },
                price: {
                    type: String,
                    required: true
                }
            }
        ]
    }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
