const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true,
            default: 'g'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sauce', sauceSchema);
