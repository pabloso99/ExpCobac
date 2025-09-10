const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

// GET all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new ingredient
router.post('/', async (req, res) => {
  const ingredient = new Ingredient({
    name: req.body.name,
    unit: req.body.unit,
    price: req.body.price,
    category: req.body.category,
    supplier: req.body.supplier
  });

  try {
    const newIngredient = await ingredient.save();
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) an ingredient
router.put('/:id', async (req, res) => {
  try {
    const updatedIngredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedIngredient) return res.status(404).json({ message: 'Ingrediente no encontrado' });
    res.json(updatedIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an ingredient
router.delete('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingrediente no encontrado' });
    res.json({ message: 'Ingrediente eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
