import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Autocomplete, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Box } from '@mui/material';
import { RECIPES_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';

const Explosion = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [portions, setPortions] = useState(1);
  const [explosionResult, setExplosionResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await axios.get(RECIPES_URL);
      setRecipes(response.data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('No se pudieron cargar las recetas.');
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleExplode = async () => {
    if (!selectedRecipe || portions <= 0) {
      setError('Por favor, selecciona una receta y un número de porciones válido.');
      return;
    }
    setError('');
    try {
      const response = await axios.get(`${RECIPES_URL}/${selectedRecipe._id}/explode?portions=${portions}`);
      setExplosionResult(response.data);
    } catch (err) {
      console.error('Error exploding recipe:', err);
      setError('Error al calcular la explosión de materiales.');
      setExplosionResult(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Calculadora de Escalado de Recetas</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={recipes}
              getOptionLabel={(option) => option.title || ''}
              value={selectedRecipe}
              onChange={(event, newValue) => {
                setSelectedRecipe(newValue);
                setPortions(newValue ? newValue.portions : 1);
              }}
              renderInput={(params) => <TextField {...params} label="Selecciona una Receta" />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Nº de Porciones"
              type="number"
              value={portions}
              onChange={(e) => setPortions(parseInt(e.target.value, 10) || 1)}
              fullWidth
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" onClick={handleExplode} fullWidth size="large">Calcular</Button>
          </Grid>
        </Grid>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Paper>

      {explosionResult && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Resultado para: {explosionResult.recipeTitle}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography><b>Porciones Originales:</b> {explosionResult.originalPortions}</Typography>
            <Typography><b>Porciones Solicitadas:</b> {explosionResult.requestedPortions}</Typography>

          </Box>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={async () => {
              try {
                await axios.post('http://localhost:5000/api/production', explosionResult);
                navigate('/production');
              } catch (err) {
                setError('Error al enviar a producción. Inténtalo de nuevo.');
              }
            }}
            sx={{ mt: 2, mb: 2 }}
          >
            Mandar a Producción
          </Button>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ingrediente</TableCell>
                  <TableCell align="right">Cantidad Requerida</TableCell>
                  <TableCell>Unidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {explosionResult.ingredients.map((ing, index) => (
                  <TableRow key={index}>
                    <TableCell>{ing.name}</TableCell>
                    <TableCell align="right">{ing.quantity.toFixed(2)}</TableCell>
                    <TableCell>{ing.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default Explosion;
