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
        ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient',
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
    componentSauces: [{
        sauce: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sauce',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
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
