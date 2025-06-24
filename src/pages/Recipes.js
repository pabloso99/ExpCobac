import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardActions, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { recipeService } from '../services/recipeService';
import UnitSelect from '../components/UnitSelect';
import { useAuth } from '../contexts/AuthContext';

const Recipes = () => {
  const { isAuthenticated } = useAuth();
  console.log('Renderizando componente Recipes');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: 'g' }],
    sauces: [],
    portions: 1
  });
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Función de validación
  const validateRecipe = () => {
    // Validar ingredientes
    const hasEmptyIngredients = newRecipe.ingredients.some(ingredient => 
      !ingredient.name.trim() || !ingredient.quantity || !ingredient.unit
    );

    // Validar salsas
    const hasEmptySauceIngredients = newRecipe.sauces.some(sauce => 
      sauce.ingredients.some(ingredient => 
        !ingredient.name.trim() || !ingredient.quantity
      )
    );

    if (hasEmptyIngredients) {
      setError('Por favor, complete todos los campos de los ingredientes');
      return false;
    }

    if (hasEmptySauceIngredients) {
      setError('Por favor, complete todos los campos de los ingredientes de las salsas');
      return false;
    }

    return true;
  };

  // Función para manejar errores
  const handleError = (err) => {
    setError(err.message || 'Error desconocido');
    console.error('Error:', err);
  };

  const fetchRecipes = async () => {
    try {
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (err) {
      setError('Error al cargar las recetas');
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar ingredientes
  const handleAddIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: 'g' }]
    }));
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients.splice(index, 1);
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients[index][field] = value;
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const handleUnitChange = (index, value) => {
    handleIngredientChange(index, 'unit', value);
  };

  // Funciones para manejar salsas
  const handleAddSauce = () => {
    const sauces = Array.isArray(newRecipe.sauces) ? newRecipe.sauces : [];
    setNewRecipe({
      ...newRecipe,
      sauces: [...sauces, { name: '', description: '', ingredients: [] }]
    });
  };

  const handleAddSauceIngredient = (sauceIndex) => {
    const sauces = Array.isArray(newRecipe.sauces) ? newRecipe.sauces : [];
    const newSauces = [...sauces];
    const ingredients = Array.isArray(newSauces[sauceIndex]?.ingredients) ? newSauces[sauceIndex].ingredients : [];
    newSauces[sauceIndex] = {
      ...newSauces[sauceIndex],
      ingredients: [...ingredients, { name: '', quantity: '', unit: 'g' }]
    };
    setNewRecipe({ ...newRecipe, sauces: newSauces });
  };

  const handleRemoveSauce = (index) => {
    const sauces = Array.isArray(newRecipe.sauces) ? newRecipe.sauces : [];
    const newSauces = sauces.filter((_, i) => i !== index);
    setNewRecipe({ ...newRecipe, sauces: newSauces });
  };

  const handleRemoveSauceIngredient = (sauceIndex, ingredientIndex) => {
    const sauces = Array.isArray(newRecipe.sauces) ? newRecipe.sauces : [];
    const newSauces = [...sauces];
    const ingredients = Array.isArray(newSauces[sauceIndex]?.ingredients) ? newSauces[sauceIndex].ingredients : [];
    newSauces[sauceIndex] = {
      ...newSauces[sauceIndex],
      ingredients: ingredients.filter((_, i) => i !== ingredientIndex)
    };
    setNewRecipe({ ...newRecipe, sauces: newSauces });
  };

  const handleSauceNameChange = (index, value) => {
    const sauces = Array.isArray(newRecipe.sauces) ? newRecipe.sauces : [];
    const newSauces = [...sauces];
    newSauces[index] = { ...newSauces[index], name: value };
    setNewRecipe({ ...newRecipe, sauces: newSauces });
  };

  const handleSauceDescriptionChange = (index, value) => {
    const sauces = Array.isArray(newRecipe.sauces) ? newRecipe.sauces : [];
    const newSauces = [...sauces];
    newSauces[index] = { ...newSauces[index], description: value };
    setNewRecipe({ ...newRecipe, sauces: newSauces });
  };

  const handleSauceIngredientNameChange = (sauceIndex, ingredientIndex, value) => {
    const sauces = Array.isArray(newRecipe.sauces) ? newRecipe.sauces : [];
    const newSauces = [...sauces];
    const ingredients = Array.isArray(newSauces[sauceIndex]?.ingredients) ? newSauces[sauceIndex].ingredients : [];
    const newIngredients = [...ingredients];
    newIngredients[ingredientIndex] = { ...newIngredients[ingredientIndex], name: value };
    newSauces[sauceIndex] = { ...newSauces[sauceIndex], ingredients: newIngredients };
    setNewRecipe({ ...newRecipe, sauces: newSauces });
  };

  const handleSauceIngredientQuantityChange = (sauceIndex, ingredientIndex, value) => {
    const sauces = Array.isArray(newRecipe.sauces) ? newRecipe.sauces : [];
    const newSauces = [...sauces];
    const ingredients = Array.isArray(newSauces[sauceIndex]?.ingredients) ? newSauces[sauceIndex].ingredients : [];
    const newIngredients = [...ingredients];
    newIngredients[ingredientIndex] = { ...newIngredients[ingredientIndex], quantity: value };
    newSauces[sauceIndex] = { ...newSauces[sauceIndex], ingredients: newIngredients };
    setNewRecipe({ ...newRecipe, sauces: newSauces });
  };

  const handleSaveRecipe = async () => {
    if (!validateRecipe()) return;
    try {
      if (selectedRecipe) {
        await recipeService.update(selectedRecipe._id, newRecipe);
      } else {
        await recipeService.create(newRecipe);
      }
      await fetchRecipes();
      setOpenDialog(false);
      setNewRecipe({
        title: '',
        description: '',
        ingredients: [{ name: '', quantity: '', unit: 'g' }],
        sauces: [],
        portions: 1
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setNewRecipe({
      title: '',
      description: '',
      ingredients: [],
      sauces: [],
      portions: 1
    });
    setSelectedRecipe(null);
  };

  const handleEditRecipe = (recipe) => {
    setOpenDialog(true);
    setNewRecipe({
      ...recipe,
      ingredients: recipe.ingredients || [{ name: '', quantity: '', unit: 'g' }],
      sauces: recipe.sauces || []
    });
    setSelectedRecipe(recipe);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await recipeService.deleteRecipe(recipeId);
      setError('');
      fetchRecipes();
    } catch (error) {
      setError(error.message || 'Error al eliminar la receta');
    }
  };

  const handleSubmit = async () => {
    try {
      // Validar la receta antes de enviar
      if (!validateRecipe()) {
        return;
      }

      const data = {
        ...newRecipe,
        ingredients: newRecipe.ingredients.map(ingredient => ({
          name: ingredient.name.trim(),
          quantity: ingredient.quantity,
          unit: ingredient.unit
        })),
        sauces: newRecipe.sauces.map(sauce => ({
          name: sauce.name.trim(),
          description: sauce.description.trim(),
          ingredients: sauce.ingredients.map(ingredient => ({
            name: ingredient.name.trim(),
            quantity: ingredient.quantity,
            unit: ingredient.unit
          }))
        }))
      };

      if (selectedRecipe) {
        // Actualizar receta
        try {
          await recipeService.updateRecipe(selectedRecipe._id, data);
          setError('');
          setOpenDialog(false);
          fetchRecipes();
        } catch (error) {
          handleError(error);
        }
      } else {
        // Crear nueva receta
        try {
          await recipeService.createRecipe(data);
          setError('');
          setOpenDialog(false);
          fetchRecipes();
        } catch (error) {
          handleError(error);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Recetas
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ mb: 2 }}
        >
          Agregar Receta
        </Button>
        <Grid container spacing={3}>
          {Array.isArray(recipes) && recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {recipe.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Porciones: {recipe.portions}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      Ingredientes:
                    </Typography>
                    <List>
                      {recipe.ingredients.map((ingredient, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${ingredient.name} (${ingredient.quantity} ${ingredient.unit})`}
                          />
                        </ListItem>
                      ))}
                    </List>
                    {recipe.sauces && recipe.sauces.length > 0 && (
                      <React.Fragment>
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                          Salsas:
                        </Typography>
                        {recipe.sauces.map((sauce, index) => (
                          <Card key={index} sx={{ mb: 1 }}>
                            <CardContent>
                              <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>
                                {sauce.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {sauce.description}
                              </Typography>
                              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                                Ingredientes de la Salsa:
                              </Typography>
                              <List>
                                {Array.isArray(sauce.ingredients) ? (
                                  sauce.ingredients.map((ingredient, i) => (
                                    <ListItem key={i}>
                                      <ListItemText
                                        primary={`${ingredient.name} (${ingredient.quantity} ${ingredient.unit})`}
                                      />
                                    </ListItem>
                                  ))
                                ) : (
                                  <Typography variant="body2" color="error">
                                    Error: Ingredientes de la salsa no válidos
                                  </Typography>
                                )}
                              </List>
                            </CardContent>
                          </Card>
                        ))}
                      </React.Fragment>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleEditRecipe(recipe)}
                      startIcon={<EditIcon />}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteRecipe(recipe._id)}
                      startIcon={<DeleteIcon />}
                    >
                      Eliminar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay recetas disponibles
            </Typography>
          )}
        </Grid>
      </Container>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedRecipe ? 'Editar Receta' : 'Nueva Receta'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            fullWidth
            value={newRecipe.title}
            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
            required
            error={!newRecipe.title.trim()}
            helperText={!newRecipe.title.trim() ? 'Este campo es requerido' : ''}
          />
          <TextField
            margin="dense"
            label="Descripción"
            multiline
            rows={4}
            fullWidth
            value={newRecipe.description}
            onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
            required
            error={!newRecipe.description.trim()}
            helperText={!newRecipe.description.trim() ? 'Este campo es requerido' : ''}
          />
          <TextField
            margin="dense"
            label="Porciones"
            type="number"
            fullWidth
            value={newRecipe.portions}
            onChange={(e) => setNewRecipe({ ...newRecipe, portions: parseInt(e.target.value) })}
            required
            error={!newRecipe.portions}
            helperText={!newRecipe.portions ? 'Este campo es requerido' : ''}
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Ingredientes:
          </Typography>
          {newRecipe.ingredients.map((ingredient, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Nombre"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                required
                error={!ingredient.name.trim()}
                helperText={!ingredient.name.trim() ? 'Este campo es requerido' : ''}
              />
              <TextField
                label="Cantidad"
                type="number"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                required
                error={!ingredient.quantity}
                helperText={!ingredient.quantity ? 'Este campo es requerido' : ''}
              />
              <UnitSelect
                value={ingredient.unit}
                onChange={(unit) => handleUnitChange(index, unit)}
              />
              <IconButton onClick={() => handleRemoveIngredient(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddIngredient}
            sx={{ mb: 2 }}
          >
            Agregar Ingrediente
          </Button>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Salsas:
          </Typography>
          {newRecipe.sauces.map((sauce, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Nombre de la salsa"
                value={sauce.name}
                onChange={(e) => handleSauceNameChange(index, e.target.value)}
                required
                error={!sauce.name.trim()}
                helperText={!sauce.name.trim() ? 'Este campo es requerido' : ''}
              />
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={2}
                value={sauce.description}
                onChange={(e) => handleSauceDescriptionChange(index, e.target.value)}
              />
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                Ingredientes de la salsa:
              </Typography>
              {sauce.ingredients.map((ingredient, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <TextField
                    label="Nombre"
                    value={ingredient.name}
                    onChange={(e) => handleSauceIngredientNameChange(index, i, e.target.value)}
                    required
                    error={!ingredient.name.trim()}
                    helperText={!ingredient.name.trim() ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleSauceIngredientQuantityChange(index, i, e.target.value)}
                    required
                    error={!ingredient.quantity}
                    helperText={!ingredient.quantity ? 'Este campo es requerido' : ''}
                  />
                  <UnitSelect
                    value={ingredient.unit}
                    onChange={(unit) => handleSauceChange(index, i, 'unit', unit)}
                  />
                  <IconButton onClick={() => handleRemoveSauceIngredient(index, i)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={() => handleAddSauceIngredient(index)}
                sx={{ mb: 1 }}
              >
                Agregar Ingrediente de Salsa
              </Button>
              <IconButton onClick={() => handleRemoveSauce(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddSauce}
          >
            Agregar Salsa
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedRecipe ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Recipes;
