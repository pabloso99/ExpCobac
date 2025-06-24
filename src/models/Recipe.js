const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
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
    sauces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sauce',
        required: true
    }],
    portions: {
        type: Number,
        required: true,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

recipeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
