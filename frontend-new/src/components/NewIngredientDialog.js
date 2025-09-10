import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const categories = ['proteínas', 'vegetales', 'frutas', 'cereales', 'lacteos', 'especias', 'aceites', 'otros'];
const units = ['gramos', 'kilogramos', 'litros', 'mililitros', 'unidades', 'cucharadas', 'cucharaditas', 'tazas'];

const NewIngredientDialog = ({ open, onClose, onSave, initialName }) => {
  const [ingredient, setIngredient] = useState({ name: '', unit: 'gramos', price: 0, category: 'otros', supplier: '' });

  useEffect(() => {
    if (open) {
      setIngredient(prev => ({ ...prev, name: initialName }));
    }
  }, [open, initialName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngredient(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(ingredient);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Crear Nuevo Ingrediente</DialogTitle>
      <DialogContent>
        <TextField label="Nombre" name="name" value={ingredient.name} onChange={handleChange} fullWidth margin="normal" disabled />
        <TextField label="Precio" name="price" type="number" value={ingredient.price} onChange={handleChange} fullWidth margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Unidad</InputLabel>
          <Select name="unit" value={ingredient.unit} onChange={handleChange} label="Unidad">
            {units.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Categoría</InputLabel>
          <Select name="category" value={ingredient.category} onChange={handleChange} label="Categoría">
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="Proveedor" name="supplier" value={ingredient.supplier} onChange={handleChange} fullWidth margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewIngredientDialog;
