const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Logs para depuración
router.use((req, res, next) => {
    console.log('Solicitud:', req.method, req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Obtener todas las recetas
router.get('/', async (req, res) => {
    try {
        console.log('Obteniendo todas las recetas');
        const recipes = await Recipe.find();
        console.log('Recetas encontradas:', recipes.length);
        // Aseguramos que siempre devolvemos un array
        const result = Array.isArray(recipes) ? recipes : [];
        res.json(result);
    } catch (error) {
        console.error('Error detallado al obtener recetas:', {
            message: error.message,
            stack: error.stack,
            type: error.name
        });
        res.status(500).json({ 
            error: 'Error al obtener recetas',
            details: error.message 
        });
    }
});

// Crear nueva receta
router.post('/', async (req, res) => {
    try {
        console.log('Creando nueva receta:', req.body);
        const recipe = new Recipe(req.body);
        await recipe.save();
        console.log('Receta creada:', recipe._id);
        res.status(201).json(recipe);
    } catch (error) {
        console.error('Error detallado al crear receta:', {
            message: error.message,
            stack: error.stack,
            type: error.name
        });
        res.status(400).json({ 
            error: 'Error al crear receta',
            details: error.message 
        });
    }
});

// Obtener receta específica
router.get('/:id', async (req, res) => {
    try {
        console.log('Obteniendo receta con ID:', req.params.id);
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            console.log('Receta no encontrada:', req.params.id);
            return res.status(404).json({ 
                error: 'Receta no encontrada',
                id: req.params.id 
            });
        }
        console.log('Receta encontrada:', recipe._id);
        res.json(recipe);
    } catch (error) {
        console.error('Error detallado al obtener receta:', {
            message: error.message,
            stack: error.stack,
            type: error.name
        });
        res.status(500).json({ 
            error: 'Error al obtener receta',
            details: error.message 
        });
    }
});

// Actualizar receta
router.put('/:id', async (req, res) => {
    try {
        console.log('Actualizando receta con ID:', req.params.id);
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            console.log('Receta no encontrada:', req.params.id);
            return res.status(404).json({ 
                error: 'Receta no encontrada',
                id: req.params.id 
            });
        }
        
        Object.assign(recipe, req.body);
        await recipe.save();
        console.log('Receta actualizada:', recipe._id);
        res.json(recipe);
    } catch (error) {
        console.error('Error detallado al actualizar receta:', {
            message: error.message,
            stack: error.stack,
            type: error.name
        });
        res.status(400).json({ 
            error: 'Error al actualizar receta',
            details: error.message 
        });
    }
});

// Eliminar receta
router.delete('/:id', async (req, res) => {
    try {
        console.log('Eliminando receta con ID:', req.params.id);
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            console.log('Receta no encontrada:', req.params.id);
            return res.status(404).json({ 
                error: 'Receta no encontrada',
                id: req.params.id 
            });
        }
        await recipe.deleteOne();
        console.log('Receta eliminada:', req.params.id);
        res.json({ message: 'Receta eliminada' });
    } catch (error) {
        console.error('Error detallado al eliminar receta:', {
            message: error.message,
            stack: error.stack,
            type: error.name
        });
        res.status(500).json({ 
            error: 'Error al eliminar receta',
            details: error.message 
        });
    }
});

module.exports = router;
