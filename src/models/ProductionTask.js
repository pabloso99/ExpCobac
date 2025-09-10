const mongoose = require('mongoose');

const productionTaskSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    required: true
  },
  steps: [{
    type: String
  }],
  requestedPortions: {
    type: Number,
    required: true
  },
  ingredients: [{
    name: String,
    quantity: Number,
    unit: String
  }],
  totalCost: {
    type: Number
  },
  status: {
    type: String,
    required: true,
    enum: ['Pendiente', 'En Progreso', 'Completado'],
    default: 'Pendiente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProductionTask', productionTaskSchema);
