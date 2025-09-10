const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { convertUnit, formatQuantity } = require('../utils/unitConverter');

// Logs para depuración
router.use((req, res, next) => {
    console.log('Solicitud:', req.method, req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Get all recipes with calculated costs
router.get('/costs', async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate({ path: 'ingredients.ingredient', model: 'Ingredient' })
            .populate({
                path: 'sauces.sauce',
                model: 'Sauce',
                populate: { path: 'ingredients.ingredient', model: 'Ingredient' }
            });

        const recipesWithCosts = recipes.map(recipe => {
            let totalCost = 0;
            const ingredientMap = {}; // Inicializar el mapa de ingredientes

            const processIngredients = (ingredients, multiplier = 1) => {
                for (const item of ingredients) {
                    if (item.ingredient) {
                        const price = item.ingredient.price || 0;
                        const quantity = parseFloat(item.quantity) || 0;
                        if (item.ingredient.unit === 'unidades' || item.ingredient.unit === 'pza') {
                            totalCost += price * quantity * multiplier;
                        } else {
                            // Para ingredientes por peso/volumen, asumimos que el precio es por la unidad base (kg o L)
                            // y la cantidad en la receta está en una unidad compatible (g o ml)
                            // Esta lógica puede necesitar más refinamiento si las unidades son más complejas
                            let baseQuantity = quantity;
                            try {
                                baseQuantity = convertUnit(quantity, item.unit, item.ingredient.unit === 'gramos' ? 'kilogramos' : 'litros');
                            } catch(e) { /* No se puede convertir, usar cantidad tal cual */ }
                            totalCost += price * baseQuantity * multiplier;
                        }
                    }
                }
            };

            processIngredients(recipe.ingredients);

            for (const sauceItem of recipe.sauces) {
                if (sauceItem.sauce) {
                    const sauceMultiplier = (sauceItem.quantity || 0) / 1; // Asumiendo receta de salsa para 1 unidad
                    processIngredients(sauceItem.sauce.ingredients, sauceMultiplier);
                }
            }

            // Esta sección parece tener un error lógico, ya que ingredientMap no se llena.
            // La lógica de costos se hace directamente en totalCost. 
            // Para devolver un desglose, necesitamos un mapa.

            const detailedIngredientMap = {};
            const processForSummary = (ingredients, multiplier = 1) => {
                for (const item of ingredients) {
                    if (item.ingredient) {
                        const id = item.ingredient._id.toString();
                        if (!detailedIngredientMap[id]) {
                            detailedIngredientMap[id] = { name: item.ingredient.name, quantity: 0, unit: item.unit, cost: 0 };
                        }
                        const quantity = parseFloat(item.quantity) || 0;
                        detailedIngredientMap[id].quantity += quantity * multiplier;
                        detailedIngredientMap[id].cost += (item.ingredient.price || 0) * quantity * multiplier;
                    }
                }
            };

            processForSummary(recipe.ingredients);
            for (const sauceItem of recipe.sauces) {
                if (sauceItem.sauce) {
                    processForSummary(sauceItem.sauce.ingredients, (sauceItem.quantity || 0) / 1);
                }
            }

            return {
                _id: recipe._id,
                title: recipe.title,
                portions: recipe.portions,
                totalCost: totalCost,
                costPerPortion: totalCost / recipe.portions,
                ingredients: Object.values(detailedIngredientMap)
            };
        });

        res.json(recipesWithCosts);

    } catch (error) {
        res.status(500).json({ message: 'Error al calcular costos de recetas', error: error.message });
    }
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
        // Usar findByIdAndUpdate con { new: true } para obtener el documento actualizado
        // y runValidators: true para asegurar que se apliquen las validaciones del esquema.
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!recipe) {
            console.log('Receta no encontrada para actualizar:', req.params.id);
            return res.status(404).json({ error: 'Receta no encontrada' });
        }
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

// Explode recipe
router.get('/:id/explode', async (req, res) => {
    try {
        const { portions } = req.query;
        const recipe = await Recipe.findById(req.params.id)
            .populate({
                path: 'ingredients.ingredient',
                model: 'Ingredient'
            })
            .populate({
                path: 'sauces.sauce',
                model: 'Sauce',
                populate: {
                    path: 'ingredients.ingredient',
                    model: 'Ingredient'
                }
            });

        if (!recipe) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }

        const scale = portions / recipe.portions;
        const ingredientMap = {};

        const baseUnits = {
            'gramos': 'gramos',
            'kilogramos': 'gramos',
            'mililitros': 'mililitros',
            'litros': 'mililitros',
        };

        function processIngredientList(ingredients, multiplier = 1) {
            for (const item of ingredients) {
                if (!item.ingredient) continue;

                const id = item.ingredient._id.toString();
                const baseUnit = baseUnits[item.unit] || item.unit;

                if (!ingredientMap[id]) {
                    ingredientMap[id] = { name: item.ingredient.name, quantity: 0, unit: baseUnit, price: item.ingredient.price };
                }

                let amountInBaseUnit = parseFloat(item.quantity) * multiplier;
                if (item.unit !== baseUnit) {
                    try {
                        amountInBaseUnit = convertUnit(amountInBaseUnit, item.unit, baseUnit);
                    } catch (e) { /* Ignorar si no hay conversión */ }
                }
                ingredientMap[id].quantity += amountInBaseUnit;
            }
        }

        processIngredientList(recipe.ingredients, scale);

        for (const sauceItem of recipe.sauces) {
            if (sauceItem.sauce) {
                const sauceScale = (sauceItem.quantity / 1) * scale; // Asumiendo que la receta de la salsa es para 1 'unidad'
                processIngredientList(sauceItem.sauce.ingredients, sauceScale);
            }
        }

        console.log('--- Ingredient Map (Before Formatting) ---', ingredientMap);

        const explodedIngredients = Object.values(ingredientMap).map(ing => {
            console.log(`Formatting ingredient: ${ing.name}, Quantity: ${ing.quantity}, Unit: ${ing.unit}`);
            const final = formatQuantity(ing.quantity, ing.unit);
            console.log(`Formatted result: Quantity: ${final.quantity}, Unit: ${final.unit}`);
            return { name: ing.name, quantity: final.quantity, unit: final.unit, price: ing.price };
        });

        console.log('--- Exploded Ingredients (After Formatting) ---', explodedIngredients);
        const totalCost = explodedIngredients.reduce((acc, ing) => acc + (ing.quantity * (ing.price || 0)), 0);

        res.json({ 
            recipeTitle: recipe.title,
            steps: recipe.steps,
            originalPortions: recipe.portions,
            requestedPortions: parseInt(portions),
            ingredients: explodedIngredients,
            totalCost 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al explosionar la receta', error: error.message });
    }
});

module.exports = router;
