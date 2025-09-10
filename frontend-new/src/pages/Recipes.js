import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardActions, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Autocomplete } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { recipeService } from '../services/recipeService';
import UnitSelect from '../components/UnitSelect';
import NewIngredientDialog from '../components/NewIngredientDialog';
import axios from 'axios';
import { RECIPES_URL, SAUCES_URL } from '../config/api';

const styles = {
  formGroup: { mb: 2, '&:last-child': { mb: 0 } },
  ingredientGroup: { display: 'flex', gap: 2, mb: 1, alignItems: 'center' },
};

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({ title: '', description: '', ingredients: [{ ingredient: null, quantity: '', unit: 'g' }], sauces: [], portions: 1, steps: [''] });
  const [availableSauces, setAvailableSauces] = useState([]);
  const [openSauceDialog, setOpenSauceDialog] = useState(false);
  const [newSauce, setNewSauce] = useState({ name: '', description: '', ingredients: [{ ingredient: null, quantity: '', unit: 'g' }], componentSauces: [] });
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [masterIngredients, setMasterIngredients] = useState([]);
  const [openNewIngredientDialog, setOpenNewIngredientDialog] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newlyCreatedIngredient, setNewlyCreatedIngredient] = useState(null);

  const fetchSauces = useCallback(async () => {
    try {
      const response = await axios.get(SAUCES_URL);
      setAvailableSauces(response.data.filter((sauce, index, self) => index === self.findIndex((s) => s._id === sauce._id)));
    } catch (err) {
      console.error('Error fetching sauces:', err);
      setError('Error al cargar las salsas');
    }
  }, []);

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await axios.get(RECIPES_URL);
      setRecipes(response.data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Error al cargar las recetas');
    }
  }, []);

  const fetchMasterIngredients = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ingredients');
      setMasterIngredients(response.data);
    } catch (err) {
      console.error('Error fetching master ingredients:', err);
    }
  }, []);

  useEffect(() => {
    fetchSauces();
    fetchMasterIngredients();
  }, [fetchSauces, fetchMasterIngredients]);

  useEffect(() => {
    if (availableSauces.length > 0) {
        fetchRecipes();
    }
  }, [availableSauces, fetchRecipes]);

  const handleIngredientChange = useCallback((index, field, value) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index][field] = value;
    setNewRecipe(prev => ({ ...prev, ingredients: updatedIngredients }));
  }, [newRecipe.ingredients]);

  useEffect(() => {
    if (newlyCreatedIngredient) {
        if (openDialog) {
            const lastIngredientIndex = newRecipe.ingredients.length - 1;
            if (lastIngredientIndex >= 0) {
                handleIngredientChange(lastIngredientIndex, 'ingredient', newlyCreatedIngredient);
            }
        }
    }
  }, [newlyCreatedIngredient, openDialog, newRecipe.ingredients.length, handleIngredientChange]);

  const handleOpenDialog = () => {
    setSelectedRecipe(null);
    setNewRecipe({ title: '', description: '', ingredients: [{ ingredient: null, quantity: '', unit: 'g' }], sauces: [], portions: 1 });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setNewRecipe({
      ...recipe,
      ingredients: (recipe.ingredients || []).map(ing => ({ ...ing, ingredient: masterIngredients.find(mi => mi._id === ing.ingredient) })),
      sauces: (recipe.sauces || []).map(s => availableSauces.find(as => as._id === s.sauce)).filter(Boolean),
    });
    setOpenDialog(true);
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await recipeService.deleteRecipe(recipeId);
        fetchRecipes();
      } catch (err) {
        setError('Error al eliminar la receta');
      }
    }
  };

  const handleSaveRecipe = async () => {
    const payload = {
      ...newRecipe,
      ingredients: (newRecipe.ingredients || []).filter(ing => ing.ingredient).map(ing => ({ ...ing, ingredient: ing.ingredient._id })),
      steps: (newRecipe.steps || []).filter(step => step.trim() !== ''),
      sauces: newRecipe.sauces.map(s => ({ sauce: s._id, quantity: s.quantity || 0 }))
    };
    try {
      if (selectedRecipe) {
        await recipeService.updateRecipe(selectedRecipe._id, payload);
      } else {
        await recipeService.createRecipe(payload);
      }
      fetchRecipes();
      handleCloseDialog();
    } catch (err) {
      setError('Error al guardar la receta');
    }
  };



  const addIngredient = () => setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, { ingredient: null, quantity: '', unit: 'g' }] });
  const removeIngredient = (index) => setNewRecipe({ ...newRecipe, ingredients: newRecipe.ingredients.filter((_, i) => i !== index) });

  const handleStepChange = (index, value) => {
    const updatedSteps = [...newRecipe.steps];
    updatedSteps[index] = value;
    setNewRecipe({ ...newRecipe, steps: updatedSteps });
  };

  const addStep = () => {
    setNewRecipe({ ...newRecipe, steps: [...newRecipe.steps, ''] });
  };

  const removeStep = (index) => {
    const updatedSteps = newRecipe.steps.filter((_, i) => i !== index);
    setNewRecipe({ ...newRecipe, steps: updatedSteps });
  };

  const handleOpenSauceDialog = (sauce = null) => {
    if (sauce) {
        setSelectedSauce(sauce);
        setNewSauce({ ...sauce, ingredients: (sauce.ingredients || []).map(ing => ({ ...ing, ingredient: masterIngredients.find(mi => mi._id === ing.ingredient) })), componentSauces: sauce.componentSauces || [] });
    } else {
        setSelectedSauce(null);
        setNewSauce({ name: '', description: '', ingredients: [{ ingredient: null, quantity: '', unit: 'g' }], componentSauces: [] });
    }
    setOpenSauceDialog(true);
  };

  const handleCloseSauceDialog = () => {
    setOpenSauceDialog(false);
    setError('');
  };

  const handleDeleteSauce = async (sauceId) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await axios.delete(`${SAUCES_URL}/${sauceId}`);
        fetchSauces();
      } catch (err) {
        setError('Error al eliminar salsa');
      }
    }
  };

  const handleSaveSauce = async () => {
    if (!newSauce.name.trim()) {
      setError('El nombre de la salsa es requerido');
      return;
    }
    const payload = {
        ...newSauce,
        ingredients: newSauce.ingredients.filter(i => i.ingredient).map(i => ({ ...i, ingredient: i.ingredient._id })),
        componentSauces: (newSauce.componentSauces || []).map(cs => ({ sauce: cs.sauce, quantity: cs.quantity, unit: cs.unit }))
    };
    try {
        if (selectedSauce) {
            await axios.put(`${SAUCES_URL}/${selectedSauce._id}`, payload);
        } else {
            await axios.post(SAUCES_URL, payload);
        }
        fetchSauces();
        handleCloseSauceDialog();
    } catch (err) {
        setError('Error al guardar la salsa');
    }
  };

  const handleSauceIngredientChange = (index, field, value) => {
    const updatedIngredients = [...newSauce.ingredients];
    updatedIngredients[index][field] = value;
    setNewSauce({ ...newSauce, ingredients: updatedIngredients });
  };

  const addSauceIngredient = () => setNewSauce({ ...newSauce, ingredients: [...newSauce.ingredients, { ingredient: null, quantity: '', unit: 'g' }] });
  const removeSauceIngredient = (index) => setNewSauce({ ...newSauce, ingredients: newSauce.ingredients.filter((_, i) => i !== index) });

  const handleComponentSauceChange = (index, field, value) => {
    const updated = [...newSauce.componentSauces];
    updated[index][field] = value;
    setNewSauce({ ...newSauce, componentSauces: updated });
  };

  const addComponentSauce = (sauce) => {
    if (sauce && !(newSauce.componentSauces || []).find(cs => cs.sauce === sauce._id)) {
        setNewSauce({ ...newSauce, componentSauces: [...(newSauce.componentSauces || []), { sauce: sauce._id, name: sauce.name, quantity: 1, unit: 'g' }] });
    }
  };

  const removeComponentSauce = (index) => setNewSauce({ ...newSauce, componentSauces: newSauce.componentSauces.filter((_, i) => i !== index) });

  const handleOpenNewIngredientDialog = (name) => {
    setNewIngredientName(name);
    setOpenNewIngredientDialog(true);
  };

  const handleCloseNewIngredientDialog = () => {
    setOpenNewIngredientDialog(false);
    setNewIngredientName('');
    setNewlyCreatedIngredient(null);
  };

  const handleSaveNewIngredient = async (ingredientData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/ingredients', ingredientData);
      const newIng = response.data;
      setMasterIngredients(prev => [...prev, newIng]);
      setNewlyCreatedIngredient(newIng);
      handleCloseNewIngredientDialog();
    } catch (err) {
      console.error('Error creating new ingredient:', err);
      // Aquí podrías mostrar un error en el diálogo de creación
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenSauceDialog()}>Crear Salsa</Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>Crear Receta</Button>
      </Box>

      <Typography variant="h5" gutterBottom>Salsas Disponibles</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {availableSauces.map(sauce => (
          <Grid item key={sauce._id} xs={12} sm={6} md={4}>
            <Card><CardContent><Typography variant="h6">{sauce.name}</Typography></CardContent><CardActions>
              <IconButton onClick={() => handleOpenSauceDialog(sauce)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDeleteSauce(sauce._id)}><DeleteIcon /></IconButton>
            </CardActions></Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom>Recetas</Typography>
      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Card><CardContent><Typography variant="h5">{recipe.title}</Typography></CardContent><CardActions>
              <IconButton onClick={() => handleEditRecipe(recipe)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDeleteRecipe(recipe._id)}><DeleteIcon /></IconButton>
            </CardActions></Card>
          </Grid>
        ))}
      </Grid>

      {/* Recipe Dialog */}
      <Dialog open={openDialog} onClose={(e, r) => r !== 'backdropClick' && handleCloseDialog()} fullWidth maxWidth="md">
        <DialogTitle>{selectedRecipe ? 'Editar Receta' : 'Nueva Receta'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Título" value={newRecipe.title} onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })} fullWidth sx={styles.formGroup} />

          <TextField label="Porciones" type="number" value={newRecipe.portions} onChange={(e) => setNewRecipe({ ...newRecipe, portions: parseInt(e.target.value, 10) || 1 })} fullWidth sx={styles.formGroup} />

          <Typography variant="h6" sx={{ mt: 2 }}>Ingredientes</Typography>
          {newRecipe.ingredients.map((ing, index) => (
            <Box key={index} sx={styles.ingredientGroup}>
              <Autocomplete
                freeSolo
                options={masterIngredients}
                getOptionLabel={(option) => option.name || ''}
                value={ing.ingredient}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setTimeout(() => {
                      handleOpenNewIngredientDialog(newValue);
                    });
                  } else if (newValue && newValue.inputValue) {
                    handleOpenNewIngredientDialog(newValue.inputValue);
                  } else {
                    handleIngredientChange(index, 'ingredient', newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = options.filter(option =>
                    option.name.toLowerCase().includes(params.inputValue.toLowerCase())
                  );

                  if (params.inputValue !== '' && !filtered.some(option => option.name.toLowerCase() === params.inputValue.toLowerCase())) {
                    filtered.push({
                      inputValue: params.inputValue,
                      name: `Añadir "${params.inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                renderInput={(params) => <TextField {...params} label="Ingrediente" />}
                sx={{ flexGrow: 1 }}
              />
              <TextField label="Cantidad" type="number" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} sx={{ width: '100px' }} />
              <UnitSelect value={ing.unit} onChange={(v) => handleIngredientChange(index, 'unit', v)} />
              <IconButton onClick={() => removeIngredient(index)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          <Button onClick={addIngredient} sx={{ mt: 1 }}>Añadir Ingrediente</Button>

          <Typography variant="h6" sx={{ mt: 2 }}>Pasos</Typography>
          {(newRecipe.steps || []).map((step, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <TextField
                label={`Paso ${index + 1}`}
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                fullWidth
                multiline
              />
              <IconButton onClick={() => removeStep(index)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          <Button onClick={addStep} sx={{ mt: 1 }}>Añadir Paso</Button>

          <Typography variant="h6" sx={{ mt: 2 }}>Salsas</Typography>
          <Autocomplete multiple options={availableSauces} getOptionLabel={(o) => o.name} value={newRecipe.sauces} isOptionEqualToValue={(o, v) => o._id === v._id} onChange={(e, v) => setNewRecipe({ ...newRecipe, sauces: v })} renderInput={(p) => <TextField {...p} label="Añadir Salsas" />} sx={{ mb: 2 }} />
          {newRecipe.sauces.map((sauce, index) => (
            <Box key={sauce._id} sx={styles.ingredientGroup}>
              <TextField label="Salsa" value={sauce.name} disabled sx={{ flexGrow: 1 }} />
              <TextField label="Cantidad (g)" type="number" value={sauce.quantity || ''} onChange={(e) => setNewRecipe({ ...newRecipe, sauces: newRecipe.sauces.map((s, i) => i === index ? { ...s, quantity: parseInt(e.target.value, 10) } : s) })} sx={{ width: '120px' }} />
            </Box>
          ))}
        </DialogContent>
        <DialogActions><Button onClick={handleCloseDialog}>Cancelar</Button><Button onClick={handleSaveRecipe} variant="contained">Guardar</Button></DialogActions>
      </Dialog>

      {/* Sauce Dialog */}
      <Dialog open={openSauceDialog} onClose={(e, r) => r !== 'backdropClick' && handleCloseSauceDialog()} fullWidth maxWidth="sm">
        <DialogTitle>{selectedSauce ? 'Editar Salsa' : 'Nueva Salsa'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nombre" value={newSauce.name} onChange={(e) => setNewSauce({ ...newSauce, name: e.target.value })} fullWidth sx={styles.formGroup} />
          <TextField label="Descripción" value={newSauce.description} onChange={(e) => setNewSauce({ ...newSauce, description: e.target.value })} fullWidth multiline rows={2} sx={styles.formGroup} />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Ingredientes</Typography>
          {newSauce.ingredients.map((ing, index) => (
            <Box key={index} sx={styles.ingredientGroup}>
              <Autocomplete options={masterIngredients} getOptionLabel={(o) => o.name || ''} value={ing.ingredient} onChange={(e, v) => handleSauceIngredientChange(index, 'ingredient', v)} isOptionEqualToValue={(o, v) => o._id === v._id} renderInput={(p) => <TextField {...p} label="Ingrediente" />} sx={{ flexGrow: 1 }} />
              <TextField label="Cantidad" type="number" value={ing.quantity} onChange={(e) => handleSauceIngredientChange(index, 'quantity', e.target.value)} sx={{ width: '100px' }} />
              <UnitSelect value={ing.unit} onChange={(v) => handleSauceIngredientChange(index, 'unit', v)} />
              <IconButton onClick={() => removeSauceIngredient(index)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          <Button onClick={addSauceIngredient} sx={{ mt: 1 }}>Añadir Ingrediente</Button>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Salsas Componentes</Typography>
          <Autocomplete options={availableSauces.filter(s => s._id !== selectedSauce?._id)} getOptionLabel={(o) => o.name} onChange={(e, v) => v && addComponentSauce(v)} renderInput={(p) => <TextField {...p} label="Buscar y añadir salsa" />} sx={{ mb: 2 }} />
          {(newSauce.componentSauces || []).map((cs, index) => (
            <Box key={index} sx={styles.ingredientGroup}>
              <TextField label="Salsa Componente" value={cs.name} disabled sx={{ flexGrow: 1 }} />
              <TextField label="Cantidad" type="number" value={cs.quantity} onChange={(e) => handleComponentSauceChange(index, 'quantity', e.target.value)} sx={{ width: '100px' }} />
              <UnitSelect value={cs.unit} onChange={(v) => handleComponentSauceChange(index, 'unit', v)} />
              <IconButton onClick={() => removeComponentSauce(index)}><DeleteIcon /></IconButton>
            </Box>
          ))}
        </DialogContent>
        <DialogActions><Button onClick={handleCloseSauceDialog}>Cancelar</Button><Button onClick={handleSaveSauce} variant="contained">Guardar</Button></DialogActions>
      </Dialog>

      {/* New Ingredient Dialog */}
      <NewIngredientDialog 
        open={openNewIngredientDialog} 
        onClose={handleCloseNewIngredientDialog} 
        onSave={handleSaveNewIngredient} 
        initialName={newIngredientName} 
      />
    </Container>
  );
}
