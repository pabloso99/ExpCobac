const express = require('express');
const router = express.Router();
const ProductionTask = require('../models/ProductionTask');
const { formatQuantity } = require('../utils/unitConverter');

// GET all production tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await ProductionTask.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new production task
router.post('/', async (req, res) => {
  const formattedIngredients = req.body.ingredients.map(ing => {
    const { quantity, unit } = formatQuantity(ing.quantity, ing.unit);
    return { ...ing, quantity, unit };
  });

  const task = new ProductionTask({
    recipeName: req.body.recipeTitle,
    steps: req.body.steps,
    requestedPortions: req.body.requestedPortions,
    ingredients: formattedIngredients,
    totalCost: req.body.totalCost,
    status: 'Pendiente'
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) a task's status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTask = await ProductionTask.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedTask) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await ProductionTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
