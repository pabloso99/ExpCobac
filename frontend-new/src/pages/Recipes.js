import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardActions, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert, Autocomplete } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { recipeService } from '../services/recipeService';
import UnitSelect from '../components/UnitSelect';
import axios from 'axios';
import { RECIPES_URL, SAUCES_URL } from '../config/api';

// Helper functions
const fetchRecipes = async () => {
  try {
    const response = await axios.get(RECIPES_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

const getSauceInfo = async (sauceId) => {
  try {
    const response = await axios.get(`${SAUCES_URL}/${sauceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sauce ${sauceId}:`, error);
    return null;
  }
};

// Estilos globales
const styles = {
  formGroup: {
    mb: 2,
    '&:last-child': {
      mb: 0
    }
  },
  ingredientGroup: {
    display: 'flex',
    gap: 2,
    mb: 1,
    alignItems: 'center'
  },
  inputField: {
    width: '100%'
  },
  buttonGroup: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap'
  },
  paper: {
    p: 2,
    mb: 2
  }
};

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: 'g' }],
    sauces: [],
    portions: 1
  });
  const [availableSauces, setAvailableSauces] = useState([]);
  const [openSauceDialog, setOpenSauceDialog] = useState(false);
  const [newSauce, setNewSauce] = useState({ name: '', description: '', ingredients: [{ name: '', quantity: '', unit: 'g' }] });

  const fetchSauces = useCallback(async () => {
    try {
      const response = await axios.get(SAUCES_URL);
      setAvailableSauces(response.data);
    } catch (error) {
      console.error('Error fetching sauces:', error);
      setError('Error al cargar las salsas');
    }
  }, []);

  const fetchRecipesWithSauces = useCallback(async () => {
    try {
      const recipesData = await fetchRecipes();
      const recipesWithSauces = await Promise.all(
        recipesData.map(async (recipe) => {
          const saucesData = await Promise.all(
            recipe.sauces.map(async (sauceId) => {
              try {
                const sauce = await getSauceInfo(sauceId);
                return sauce;
              } catch (error) {
                console.error(`Error fetching sauce ${sauceId}:`, error);
                return null;
              }
            })
          );
          return {
            ...recipe,
            sauces: saucesData.filter(Boolean)
          };
        })
      );
      setRecipes(recipesWithSauces);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Error al cargar las recetas');
    }
  }, []);

  useEffect(() => {
    fetchRecipesWithSauces();
    fetchSauces();
  }, [fetchRecipesWithSauces, fetchSauces]);

  // Handlers for Sauce Dialog
  const handleOpenSauceDialog = () => {
    setNewSauce({ name: '', description: '', ingredients: [{ name: '', quantity: '', unit: 'g' }] });
    setOpenSauceDialog(true);
  };

  const handleCloseSauceDialog = () => {
    setOpenSauceDialog(false);
    setError('');
  };

  const handleSaveSauce = async () => {
    if (!newSauce.name.trim()) {
      setError('El nombre de la salsa es requerido');
      return;
    }
    try {
      await axios.post(SAUCES_URL, newSauce);
      handleCloseSauceDialog();
      fetchSauces(); // Refresh sauces list
    } catch (error) {
      console.error('Error al guardar salsa:', error);
      setError('Error al guardar la salsa');
    }
  };

  const handleSauceIngredientChange = (index, field, value) => {
    const updatedIngredients = [...newSauce.ingredients];
    updatedIngredients[index][field] = value;
    setNewSauce({ ...newSauce, ingredients: updatedIngredients });
  };

  const addSauceIngredient = () => {
    setNewSauce({ ...newSauce, ingredients: [...newSauce.ingredients, { name: '', quantity: '', unit: 'g' }] });
  };

  const removeSauceIngredient = (index) => {
    const updatedIngredients = [...newSauce.ingredients];
    updatedIngredients.splice(index, 1);
    setNewSauce({ ...newSauce, ingredients: updatedIngredients });
  };

  // Funciones de manejo de eventos
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setNewRecipe({
      title: '',
      description: '',
      ingredients: [{ name: '', quantity: '', unit: 'g' }],
      sauces: [], 
      portions: 1
    });
    setSelectedRecipe(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecipe(null);
    setError('');
  };

  const handleEditRecipe = (recipe) => {
    setOpenDialog(true);
    setSelectedRecipe(recipe);
    setNewRecipe({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      sauces: recipe.sauces || [],
      portions: recipe.portions
    });
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await recipeService.deleteRecipe(recipeId);
      const updatedRecipes = recipes.filter(recipe => recipe._id !== recipeId);
      setRecipes(updatedRecipes);
      setError('');
    } catch (error) {
      console.error('Error al eliminar receta:', error);
      setError('Error al eliminar la receta');
    }
  };

  const handleSaveRecipe = async () => {
    if (!validateRecipe()) return;

    try {
      const recipeData = {
        title: newRecipe.title,
        description: newRecipe.description,
        ingredients: newRecipe.ingredients,
        sauces: newRecipe.sauces,
        portions: newRecipe.portions
      };

      if (selectedRecipe) {
        await recipeService.updateRecipe(selectedRecipe._id, recipeData);
        setOpenDialog(false);
        await fetchRecipesWithSauces();
      } else {
        await recipeService.createRecipe(recipeData);
        setOpenDialog(false);
        setNewRecipe({
          title: '',
          description: '',
          ingredients: [{ name: '', quantity: '', unit: 'g' }],
          sauces: [],
          portions: 1
        });
        await fetchRecipesWithSauces();
      }
    } catch (error) {
      console.error('Error al guardar receta:', error);
      setError('Error al guardar la receta');
    }
  };

  const validateRecipe = () => {
    if (!newRecipe.title.trim()) {
      setError('El título es requerido');
      return false;
    }
    if (!newRecipe.description.trim()) {
      setError('La descripción es requerida');
      return false;
    }
    if (newRecipe.ingredients.length === 0) {
      setError('Debe agregar al menos un ingrediente');
      return false;
    }
    return true;
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenSauceDialog} sx={{ mr: 2 }}>
              Crear Salsa
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
              Crear Receta
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={3}>
            {recipes.map((recipe) => (
              <Grid item key={recipe._id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {recipe.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleEditRecipe(recipe)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRecipe(recipe._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRecipe ? 'Editar Receta' : 'Nueva Receta'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            value={newRecipe.title}
            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newRecipe.description}
            onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="h6" sx={{ mt: 2 }}>Ingredientes</Typography>
          {newRecipe.ingredients.map((ing, index) => (
            <Box key={index} sx={styles.ingredientGroup}>
              <TextField
                label="Nombre"
                value={ing.name}
                onChange={(e) => {
                  const newIngredients = [...newRecipe.ingredients];
                  newIngredients[index].name = e.target.value;
                  setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                }}
                sx={{ flex: 3 }}
              />
              <TextField
                label="Cantidad"
                type="number"
                value={ing.quantity}
                onChange={(e) => {
                  const newIngredients = [...newRecipe.ingredients];
                  newIngredients[index].quantity = e.target.value;
                  setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                }}
                sx={{ flex: 1 }}
              />
              <UnitSelect
                value={ing.unit}
                onChange={(e) => {
                  const newIngredients = [...newRecipe.ingredients];
                  newIngredients[index].unit = e.target.value;
                  setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                }}
                sx={{ flex: 1 }}
              />
              <IconButton onClick={() => {
                const newIngredients = newRecipe.ingredients.filter((_, i) => i !== index);
                setNewRecipe({ ...newRecipe, ingredients: newIngredients });
              }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button onClick={() => {
            setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, { name: '', quantity: '', unit: 'g' }] });
          }} sx={{ mt: 1 }}>
            Añadir Ingrediente
          </Button>

          <Typography variant="h6" sx={{ mt: 2 }}>Salsas</Typography>
          <Autocomplete
            multiple
            options={availableSauces}
            getOptionLabel={(option) => option.name}
            value={newRecipe.sauces}
            onChange={(event, newValue) => {
              setNewRecipe({ ...newRecipe, sauces: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Salsas"
                placeholder="Seleccionar salsas"
              />
            )}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Porciones"
            type="number"
            fullWidth
            value={newRecipe.portions}
            onChange={(e) => setNewRecipe({ ...newRecipe, portions: parseInt(e.target.value, 10) || 1 })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveRecipe} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      {/* Sauce Creation Dialog */}
      <Dialog open={openSauceDialog} onClose={handleCloseSauceDialog} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nueva Salsa</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={styles.formGroup}>
            <TextField label="Nombre de la Salsa" value={newSauce.name} onChange={(e) => setNewSauce({ ...newSauce, name: e.target.value })} fullWidth />
          </Box>
          <Box sx={styles.formGroup}>
            <TextField label="Descripción" value={newSauce.description} onChange={(e) => setNewSauce({ ...newSauce, description: e.target.value })} fullWidth multiline rows={3} />
          </Box>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Ingredientes de la Salsa</Typography>
          {newSauce.ingredients.map((ing, index) => (
            <Box key={index} sx={styles.ingredientGroup}>
              <TextField label="Nombre" value={ing.name} onChange={(e) => handleSauceIngredientChange(index, 'name', e.target.value)} sx={{ flex: 3 }} />
              <TextField label="Cantidad" value={ing.quantity} onChange={(e) => handleSauceIngredientChange(index, 'quantity', e.target.value)} sx={{ flex: 1 }} />
              <UnitSelect value={ing.unit} onChange={(e) => handleSauceIngredientChange(index, 'unit', e.target.value)} />
              <IconButton onClick={() => removeSauceIngredient(index)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          <Button onClick={addSauceIngredient} sx={{ mt: 1 }}>Añadir Ingrediente</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSauceDialog}>Cancelar</Button>
          <Button onClick={handleSaveSauce} variant="contained">Guardar Salsa</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );

}
