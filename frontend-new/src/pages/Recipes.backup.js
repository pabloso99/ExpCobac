import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Card, CardContent, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert, Autocomplete, Grid, CardActions } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { recipeService } from '../services/recipeService';
import { sauceService } from '../services/sauceService';

import UnitSelect from '../components/UnitSelect';

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: 'g' }],
    sauces: [],
    portions: 1,
    get sauces() {
      return this._sauces || [];
    },
    set sauces(value) {
      this._sauces = value;
    }
  });
  const [availableSauces, setAvailableSauces] = useState([]);
  const [loadingSauces, setLoadingSauces] = useState(true);
  const [error, setError] = useState('');
  const [openSauceDialog, setOpenSauceDialog] = useState(false);
  const [openNewSauceDialog, setOpenNewSauceDialog] = useState(false);
  const [newSauce, setNewSauce] = useState({
    name: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: 'g' }]
  });

  const loadRecipes = async () => {
    try {
      const data = await recipeService.fetchRecipes();
      console.log('Recetas cargadas:', data);
      setRecipes(data || []);
      setFilteredRecipes(data || []);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
      setError('Error al cargar las recetas. Por favor, inténtalo de nuevo.');
    }
  };

  const loadAvailableSauces = async () => {
    try {
      setLoadingSauces(true);
      const data = await sauceService.getAllSauces();
      console.log('Salsas cargadas:', data);
      setAvailableSauces(data || []);
      setLoadingSauces(false);
    } catch (error) {
      console.error('Error al cargar salsas:', error);
      setLoadingSauces(false);
    }
  };

  useEffect(() => {
    loadRecipes();
    loadAvailableSauces();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setFilteredRecipes(recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      recipe.description.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecipe(null);
    setNewRecipe({
      title: '',
      description: '',
      ingredients: [{ name: '', quantity: '', unit: 'g' }],
      portions: 1
    });
    setError('');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setSelectedRecipe(null);
    setNewRecipe({
      title: '',
      description: '',
      ingredients: [{ name: '', quantity: '', unit: 'g' }],
      portions: 1
    });
  };

  const handleEditRecipe = (recipe) => {
    setOpenDialog(true);
    setSelectedRecipe(recipe);
    setNewRecipe({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      portions: recipe.portions,
      _sauces: recipe.sauces || []
    });
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await recipeService.deleteRecipe(recipeId);
      const updatedRecipes = recipes.filter(recipe => recipe._id !== recipeId);
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);
      setError('');
    } catch (error) {
      console.error('Error al eliminar receta:', error);
      setError('Error al eliminar la receta. Por favor, inténtalo de nuevo.');
    }
  };

  const validateRecipe = () => {
    const hasEmptyIngredients = newRecipe.ingredients.some(ingredient => 
      !ingredient.name?.trim() || !ingredient.quantity || !ingredient.unit
    );

    const hasEmptySauces = newRecipe.sauces?.some(sauce => 
      !sauce.name?.trim() || !sauce.description?.trim() || 
      sauce.ingredients?.some(ingredient => 
        !ingredient.name?.trim() || !ingredient.quantity || !ingredient.unit
      )
    );

    if (!newRecipe.title?.trim()) {
      setError('Por favor, ingrese un título para la receta');
      return false;
    }

    if (!newRecipe.description?.trim()) {
      setError('Por favor, ingrese una descripción para la receta');
      return false;
    }

    if (!newRecipe.portions) {
      setError('Por favor, ingrese el número de porciones');
      return false;
    }

    if (hasEmptyIngredients) {
      setError('Por favor, complete todos los campos de los ingredientes');
      return false;
    }

    if (hasEmptySauces) {
      setError('Por favor, complete todos los campos de las salsas y sus ingredientes');
      return false;
    }

    return true;
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const handleRemoveSauce = (index) => {
    const newSauces = [...(newRecipe.sauces || [])];
    newSauces.splice(index, 1);
    setNewRecipe({ ...newRecipe, _sauces: newSauces });
  };

  const handleSauceIngredientChange = (sauceIndex, ingredientIndex, field, value) => {
    const newSauces = [...(newRecipe.sauces || [])];
    const sauce = { ...newSauces[sauceIndex] } || {};
    const ingredients = [...(sauce.ingredients || [])];
    if (!ingredients[ingredientIndex]) {
      ingredients[ingredientIndex] = {};
    }
    ingredients[ingredientIndex] = { ...ingredients[ingredientIndex], [field]: value };
    sauce.ingredients = ingredients;
    newSauces[sauceIndex] = sauce;
    setNewRecipe({ ...newRecipe, _sauces: newSauces });
  };

  const handleSauceUnitChange = (sauceIndex, ingredientIndex, value) => {
    const newSauces = [...(newRecipe.sauces || [])];
    const sauce = { ...newSauces[sauceIndex] } || {};
    const ingredients = [...(sauce.ingredients || [])];
    if (!ingredients[ingredientIndex]) {
      ingredients[ingredientIndex] = {};
    }
    ingredients[ingredientIndex] = { ...ingredients[ingredientIndex], unit: value };
    sauce.ingredients = ingredients;
    newSauces[sauceIndex] = sauce;
    setNewRecipe({ ...newRecipe, _sauces: newSauces });
  };

  const handleAddIngredient = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { name: '', quantity: '', unit: 'g' }]
    });
  };

  const handleUnitChange = (index, value) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], unit: value };
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const handleSauceChange = (index, field, value) => {
    const newSauces = [...(newRecipe.sauces || [])];
    newSauces[index] = { ...newSauces[index], [field]: value };
    setNewRecipe({ ...newRecipe, _sauces: newSauces });
  };

  const handleAddSauceIngredient = (sauceIndex) => {
    const newSauces = [...(newRecipe.sauces || [])];
    const sauce = { ...newSauces[sauceIndex] } || {};
    sauce.ingredients = [...(sauce.ingredients || []), { name: '', quantity: '', unit: 'g' }];
    newSauces[sauceIndex] = sauce;
    setNewRecipe({ ...newRecipe, sauces: newSauces });
  };

  const handleAddSauce = () => {
    setOpenSauceDialog(true);
  };

  const handleAddNewSauceIngredient = () => {
    setNewSauce({
      ...newSauce,
      ingredients: [...newSauce.ingredients, { name: '', quantity: '', unit: 'g' }]
    });
  };

  const handleNewSauceIngredientChange = (index, field, value) => {
    const newIngredients = [...newSauce.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setNewSauce({ ...newSauce, ingredients: newIngredients });
  };

  const handleNewSauceUnitChange = (index, value) => {
    const newIngredients = [...newSauce.ingredients];
    newIngredients[index] = { ...newIngredients[index], unit: value };
    setNewSauce({ ...newSauce, ingredients: newIngredients });
  };

  const handleRemoveNewSauceIngredient = (index) => {
    const newIngredients = [...newSauce.ingredients];
    newIngredients.splice(index, 1);
    setNewSauce({ ...newSauce, ingredients: newIngredients });
  };

  const handleCreateNewSauce = async () => {
    const isValid = validateNewSauce();
    if (!isValid) return;

    const newSauceData = {
      name: newSauce.name,
      description: newSauce.description,
      ingredients: newSauce.ingredients
    };

    const createdSauce = await createNewSauce(newSauceData);
    if (createdSauce) {
      // Agregar la nueva salsa a la receta
      const newSauces = [...(newRecipe.sauces || [])];
      newSauces.push(newSauce);
      setNewRecipe({
        ...newRecipe,
        sauces: newSauces
      });

      // Resetear el formulario de nueva salsa
      setNewSauce({
        name: '',
        description: '',
        ingredients: [{ name: '', quantity: '', unit: 'g' }]
      });
      setOpenNewSauceDialog(false);
    }
  };

  const validateNewSauce = () => {
    const hasEmptyIngredients = newSauce.ingredients.some(ingredient => 
      !ingredient.name?.trim() || !ingredient.quantity || !ingredient.unit
    );

    if (!newSauce.name?.trim()) {
      setError('Por favor, ingrese un nombre para la salsa');
      return false;
    }

    if (!newSauce.description?.trim()) {
      setError('Por favor, ingrese una descripción para la salsa');
      return false;
    }

    if (hasEmptyIngredients) {
      setError('Por favor, complete todos los campos de los ingredientes de la salsa');
      return false;
    }

    return true;
  };

  const createNewSauce = async (sauceData) => {
    try {
      const newSauce = await sauceService.createSauce(sauceData);
      // Actualizar la lista de salsas disponibles
      const updatedSauces = [...availableSauces, newSauce];
      setAvailableSauces(updatedSauces);
      return newSauce;
    } catch (error) {
      console.error('Error al crear la salsa:', error);
      setError('Error al crear la salsa. Por favor, inténtalo de nuevo.');
      return null;
    }
  };

  const handleSauceSelect = (selectedSauce) => {
    if (selectedSauce) {
      // Si es una salsa existente, la agregamos directamente
      const newSauces = [...(newRecipe.sauces || [])];
      newSauces.push({
        name: selectedSauce.name,
        description: selectedSauce.description,
        ingredients: selectedSauce.ingredients
      });
      setNewRecipe({
        ...newRecipe,
        sauces: newSauces
      });
    } else {
      // Si no seleccionaron ninguna salsa, mostramos el formulario para crear una nueva
      setOpenNewSauceDialog(true);
    }
    setOpenSauceDialog(false);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients.splice(index, 1);
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const handleRemoveSauceIngredient = (sauceIndex, ingredientIndex) => {
    const newSauces = [...(newRecipe._sauces || [])];
    const sauce = { ...newSauces[sauceIndex] } || {};
    const ingredients = [...(sauce.ingredients || [])];
    ingredients.splice(ingredientIndex, 1);
    sauce.ingredients = ingredients;
    newSauces[sauceIndex] = sauce;
    setNewRecipe({ ...newRecipe, _sauces: newSauces });
  };

  const handleSubmit = async () => {
    if (!validateRecipe()) return;
    try {
      if (selectedRecipe) {
        await recipeService.updateRecipe(selectedRecipe._id, newRecipe);
      } else {
        await recipeService.createRecipe(newRecipe);
      }
      handleCloseDialog();
      loadRecipes();
    } catch (error) {
      console.error('Error al guardar receta:', error);
      setError('Error al guardar la receta. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Recetas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Nueva Receta
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {recipe.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton onClick={() => handleEditRecipe(recipe)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteRecipe(recipe._id)} color="error">
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecipe ? 'Editar Receta' : 'Nueva Receta'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Título"
              variant="outlined"
              size="small"
              fullWidth
              value={newRecipe.title}
              onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
              required
              error={!newRecipe.title?.trim()}
              helperText={!newRecipe.title?.trim() ? 'Este campo es requerido' : ''}
            />
            <TextField
              label="Descripción"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={4}
              value={newRecipe.description}
              onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
              required
              error={!newRecipe.description?.trim()}
              helperText={!newRecipe.description?.trim() ? 'Este campo es requerido' : ''}
            />
            <TextField
              label="Porciones"
              variant="outlined"
              size="small"
              type="number"
              value={newRecipe.portions}
              onChange={(e) => setNewRecipe({ ...newRecipe, portions: e.target.value })}
              required
              error={!newRecipe.portions}
              helperText={!newRecipe.portions ? 'Este campo es requerido' : ''}
            />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Ingredientes:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(newRecipe.ingredients || []).map((ingredient, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    label="Nombre"
                    variant="outlined"
                    size="small"
                    value={ingredient?.name || ''}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                    error={!ingredient?.name?.trim()}
                    helperText={!ingredient?.name?.trim() ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    label="Cantidad"
                    variant="outlined"
                    size="small"
                    sx={{ width: 120 }}
                    type="number"
                    value={ingredient?.quantity || ''}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    required
                    error={!ingredient?.quantity}
                    helperText={!ingredient?.quantity ? 'Este campo es requerido' : ''}
                  />
                  <UnitSelect
                    label="Unidad"
                    variant="outlined"
                    size="small"
                    value={ingredient?.unit || 'g'}
                    onChange={(value) => handleUnitChange(index, value)}
                  />
                  <IconButton
                    onClick={() => handleRemoveIngredient(index)}
                    color="error"
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddIngredient}
                >
                  Añadir Ingrediente
                </Button>
              </Box>
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Salsas:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(newRecipe.sauces || []).map((sauce, sauceIndex) => (
                <Box key={sauceIndex} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    label="Nombre de la Salsa"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={sauce.name}
                    onChange={(e) => handleSauceChange(sauceIndex, 'name', e.target.value)}
                    required
                    error={!sauce.name?.trim()}
                    helperText={!sauce.name?.trim() ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    label="Descripción de la Salsa"
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={sauce.description}
                    onChange={(e) => handleSauceChange(sauceIndex, 'description', e.target.value)}
                    required
                    error={!sauce.description?.trim()}
                    helperText={!sauce.description?.trim() ? 'Este campo es requerido' : ''}
                  />
                  <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                    Ingredientes de la Salsa:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {(sauce.ingredients || []).map((ingredient, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          label="Nombre"
                          variant="outlined"
                          size="small"
                          value={ingredient.name}
                          onChange={(e) => handleSauceIngredientChange(sauceIndex, index, 'name', e.target.value)}
                          required
                          error={!ingredient.name?.trim()}
                          helperText={!ingredient.name?.trim() ? 'Este campo es requerido' : ''}
                        />
                        <TextField
                          label="Cantidad"
                          variant="outlined"
                          size="small"
                          sx={{ width: 120 }}
                          type="number"
                          value={ingredient.quantity}
                          onChange={(e) => handleSauceIngredientChange(sauceIndex, index, 'quantity', e.target.value)}
                          required
                          error={!ingredient.quantity}
                          helperText={!ingredient.quantity ? 'Este campo es requerido' : ''}
                        />
                        <UnitSelect
                          label="Unidad"
                          variant="outlined"
                          size="small"
                          value={ingredient.unit}
                          onChange={(value) => handleSauceUnitChange(sauceIndex, index, value)}
                        />
                        <IconButton
                          onClick={() => handleRemoveSauceIngredient(sauceIndex, index)}
                          color="error"
                          size="small"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      onClick={() => handleAddSauceIngredient(sauceIndex)}
                      size="small"
                    >
                      Añadir Ingrediente
                    </Button>
                  </Box>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddSauce}
                size="small"
              >
                Añadir Salsa
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedRecipe ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSauceDialog}
        onClose={() => setOpenSauceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Seleccionar Salsa</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={availableSauces}
            getOptionLabel={(option) => option.name}
            loading={loadingSauces}
            onChange={(event, value) => handleSauceSelect(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecciona una salsa"
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenNewSauceDialog(true)}
              fullWidth
            >
              Crear Nueva Salsa
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSauceDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNewSauceDialog}
        onClose={() => setOpenNewSauceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Crear Nueva Salsa</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Nombre de la Salsa"
              variant="outlined"
              size="small"
              fullWidth
              value={newSauce.name}
              onChange={(e) => setNewSauce({ ...newSauce, name: e.target.value })}
              required
              error={!newSauce.name?.trim()}
              helperText={!newSauce.name?.trim() ? 'Este campo es requerido' : ''}
            />
            <TextField
              label="Descripción de la Salsa"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={newSauce.description}
              onChange={(e) => setNewSauce({ ...newSauce, description: e.target.value })}
              required
              error={!newSauce.description?.trim()}
              helperText={!newSauce.description?.trim() ? 'Este campo es requerido' : ''}
            />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Ingredientes de la Salsa:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {newSauce.ingredients.map((ingredient, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    label="Nombre"
                    variant="outlined"
                    size="small"
                    value={ingredient.name}
                    onChange={(e) => handleNewSauceIngredientChange(index, 'name', e.target.value)}
                    required
                    error={!ingredient.name?.trim()}
                    helperText={!ingredient.name?.trim() ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    label="Cantidad"
                    variant="outlined"
                    size="small"
                    sx={{ width: 120 }}
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleNewSauceIngredientChange(index, 'quantity', e.target.value)}
                    required
                    error={!ingredient.quantity}
                    helperText={!ingredient.quantity ? 'Este campo es requerido' : ''}
                  />
                  <UnitSelect
                    label="Unidad"
                    variant="outlined"
                    size="small"
                    value={ingredient.unit}
                    onChange={(value) => handleNewSauceUnitChange(index, value)}
                  />
                  <IconButton
                    onClick={() => handleRemoveNewSauceIngredient(index)}
                    color="error"
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddNewSauceIngredient}
                size="small"
              >
                Añadir Ingrediente
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewSauceDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateNewSauce}
            variant="contained"
            color="primary"
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Recipes;
