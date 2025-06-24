import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import UnitSelect from './UnitSelect';
import SauceSelect from './SauceSelect';

const RecipeForm = ({ onSubmit, initialValues = {} }) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [ingredients, setIngredients] = useState(initialValues.ingredients || [{ name: '', quantity: '', unit: '' }]);
  const [sauces, setSauces] = useState(initialValues.sauces || [{ name: '', description: '', ingredients: [] }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const handleAddSauce = () => {
    setSauces([...sauces, { name: '', description: '', ingredients: [] }]);
  };

  const handleRemoveSauce = (index) => {
    const newSauces = [...sauces];
    newSauces.splice(index, 1);
    setSauces(newSauces);
  };

  const handleSauceChange = (sauceIndex, field, value) => {
    const newSauces = [...sauces];
    if (field === '_id') {
      // Si se selecciona una salsa existente, actualizamos el ID
      newSauces[sauceIndex] = value;
    } else if (field === 'new') {
      // Si se crea una nueva salsa, usamos su ID
      newSauces[sauceIndex] = value._id;
    }
    setSauces(newSauces);
  };

  const handleAddSauceIngredient = (sauceIndex) => {
    const newSauces = [...sauces];
    newSauces[sauceIndex] = {
      ...newSauces[sauceIndex],
      ingredients: [...newSauces[sauceIndex].ingredients, { name: '', quantity: '', unit: '' }]
    };
    setSauces(newSauces);
  };

  const handleRemoveSauceIngredient = (sauceIndex, ingredientIndex) => {
    const newSauces = [...sauces];
    const newIngredients = [...newSauces[sauceIndex].ingredients];
    newIngredients.splice(ingredientIndex, 1);
    newSauces[sauceIndex] = { ...newSauces[sauceIndex], ingredients: newIngredients };
    setSauces(newSauces);
  };

  const handleSauceIngredientChange = (sauceIndex, ingredientIndex, field, value) => {
    const newSauces = [...sauces];
    const newIngredients = [...newSauces[sauceIndex].ingredients];
    newIngredients[ingredientIndex] = { ...newIngredients[ingredientIndex], [field]: value };
    newSauces[sauceIndex] = { ...newSauces[sauceIndex], ingredients: newIngredients };
    setSauces(newSauces);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      ingredients: ingredients.map(ingredient => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity,
        unit: ingredient.unit
      })),
      sauces: sauces.map(sauce => sauce),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Agregar Receta
      </Typography>

      <TextField
        fullWidth
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Descripción"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        required
      />

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Ingredientes Principales
      </Typography>

      <Grid container spacing={2}>
        {ingredients.map((ingredient, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Nombre"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                required
              />
              <TextField
                label="Cantidad"
                type="number"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                required
              />
              <UnitSelect
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              />
              <IconButton
                onClick={() => handleRemoveIngredient(index)}
                color="error"
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddIngredient}
        sx={{ mt: 2 }}
      >
        <AddIcon /> Agregar Ingrediente Principal
      </Button>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Salsas
      </Typography>

      {sauces.map((sauce, sauceIndex) => (
        <Box key={sauceIndex} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <SauceSelect
              value={sauce._id || ''}
              onChange={(sauceId) => {
                console.log('Seleccionada salsa:', sauceId);
                handleSauceChange(sauceIndex, '_id', sauceId);
              }}
              onAddNew={(newSauce) => {
                console.log('Nueva salsa:', newSauce);
                handleSauceChange(sauceIndex, 'new', newSauce);
              }}
              sx={{ width: '100%' }}
            />
            <IconButton
              onClick={() => handleRemoveSauce(sauceIndex)}
              color="error"
            >
              <RemoveIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Ingredientes de la Salsa
          </Typography>

          <Grid container spacing={2}>
            {sauce.ingredients.map((ingredient, ingredientIndex) => (
              <Grid item xs={12} key={ingredientIndex}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Nombre"
                    value={ingredient.name}
                    onChange={(e) => handleSauceIngredientChange(sauceIndex, ingredientIndex, 'name', e.target.value)}
                    required
                  />
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleSauceIngredientChange(sauceIndex, ingredientIndex, 'quantity', e.target.value)}
                    required
                  />
                  <UnitSelect
                    value={ingredient.unit}
                    onChange={(e) => handleSauceIngredientChange(sauceIndex, ingredientIndex, 'unit', e.target.value)}
                  />
                  <IconButton
                    onClick={() => handleRemoveSauceIngredient(sauceIndex, ingredientIndex)}
                    color="error"
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddSauceIngredient(sauceIndex)}
            sx={{ mt: 2 }}
          >
            <AddIcon /> Agregar Ingrediente
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddSauce}
        sx={{ mt: 2 }}
      >
        <AddIcon /> Agregar Salsa
      </Button>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" color="success">
          Guardar Receta
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeForm;
