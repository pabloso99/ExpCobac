const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Obtener todas las recetas
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        console.error('Error al obtener recetas:', error);
        res.status(500).json({ error: 'Error al obtener recetas' });
    }
});

// Crear nueva receta
router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        console.error('Error al crear receta:', error);
        res.status(400).json({ error: error.message });
    }
});

// Obtener receta específica
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }
        res.json(recipe);
    } catch (error) {
        console.error('Error al obtener receta:', error);
        res.status(500).json({ error: 'Error al obtener receta' });
    }
});

// Actualizar receta
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }
        Object.assign(recipe, req.body);
        await recipe.save();
        res.json(recipe);
    } catch (error) {
        console.error('Error al actualizar receta:', error);
        res.status(400).json({ error: 'Error al actualizar receta' });
    }
});

// Eliminar receta
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }
        await recipe.deleteOne();
        res.json({ message: 'Receta eliminada' });
    } catch (error) {
        console.error('Error al eliminar receta:', error);
        res.status(500).json({ error: 'Error al eliminar receta' });
    }
});

module.exports = router;
