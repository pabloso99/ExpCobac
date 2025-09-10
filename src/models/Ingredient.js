const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    unit: {
        type: String,
        required: true,
        enum: ['gramos', 'kilogramos', 'litros', 'mililitros', 'unidades', 'cucharadas', 'cucharaditas', 'tazas']
    },
    category: {
        type: String,
        required: true,
        enum: ['proteínas', 'vegetales', 'frutas', 'cereales', 'lacteos', 'especias', 'aceites', 'otros']
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    supplier: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índice para búsqueda eficiente
ingredientSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Ingredient', ingredientSchema);
