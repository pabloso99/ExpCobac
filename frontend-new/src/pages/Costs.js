import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { RECIPES_URL } from '../config/api';

const Costs = () => {
  const [recipeCosts, setRecipeCosts] = useState([]);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchRecipeCosts = useCallback(async () => {
    try {
      const response = await axios.get(`${RECIPES_URL}/costs`);
      setRecipeCosts(response.data);
    } catch (err) {
      console.error('Error fetching recipe costs:', err);
      setError('No se pudieron cargar los costos de las recetas.');
    }
  }, []);

  useEffect(() => {
    fetchRecipeCosts();
  }, [fetchRecipeCosts]);

  const handleRowClick = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecipe(null);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Costos de Recetas</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Paper sx={{ mt: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Receta</TableCell>
                <TableCell align="right">Costo Total</TableCell>
                <TableCell align="right">Porciones</TableCell>
                <TableCell align="right">Costo por Porción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipeCosts.map((recipe) => (
                <TableRow key={recipe._id} hover onClick={() => handleRowClick(recipe)} sx={{ cursor: 'pointer' }}>
                  <TableCell component="th" scope="row">{recipe.title}</TableCell>
                  <TableCell align="right">${recipe.totalCost.toFixed(2)}</TableCell>
                  <TableCell align="right">{recipe.portions}</TableCell>
                  <TableCell align="right">${recipe.costPerPortion.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selectedRecipe && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Desglose de: {selectedRecipe.title}</DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ingrediente</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell>Unidad</TableCell>
                    <TableCell align="right">Costo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(selectedRecipe.ingredients || []).map((ing, index) => (
                    <TableRow key={index}>
                      <TableCell>{ing.name}</TableCell>
                      <TableCell align="right">{ing.quantity.toFixed(2)}</TableCell>
                      <TableCell>{ing.unit}</TableCell>
                      <TableCell align="right">${ing.cost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Costs;
