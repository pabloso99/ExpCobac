const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
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
    sauces: [{
        sauce: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sauce',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    portions: {
        type: Number,
        required: true,
        default: 1
    },
    steps: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

recipeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
