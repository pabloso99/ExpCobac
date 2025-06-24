import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Box,
} from '@mui/material';

const SauceSelect = ({ value, onChange, onAddNew }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newSauce, setNewSauce] = useState({ name: '', description: '' });

  const mockSauces = [
    { _id: '1', name: 'Salsa de Tomate', description: 'Salsa roja clásica' },
    { _id: '2', name: 'Salsa de Yogur', description: 'Salsa blanca fresca' },
    { _id: '3', name: 'Salsa de Limón', description: 'Salsa ácida y refrescante' }
  ];

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="sauce-select-label">Seleccionar Salsa</InputLabel>
        <Select
          labelId="sauce-select-label"
          id="sauce-select"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          label="Seleccionar Salsa"
          sx={{ m: 1, minWidth: 120 }}
          displayEmpty
        >
          <MenuItem value="">
            <em>Nueva salsa</em>
          </MenuItem>
          {mockSauces.map((sauce) => (
            <MenuItem key={sauce._id} value={sauce._id}>
              {sauce.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="outlined"
        onClick={() => setOpenDialog(true)}
        sx={{ mt: 1 }}
      >
        Agregar Nueva Salsa
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nueva Salsa</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la Salsa"
            value={newSauce.name}
            onChange={(e) => setNewSauce({ ...newSauce, name: e.target.value })}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descripción"
            value={newSauce.description}
            onChange={(e) => setNewSauce({ ...newSauce, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAddNewSauce}
            sx={{ ml: 1 }}
          >
            Guardar
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default SauceSelect;
