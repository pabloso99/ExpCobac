import React from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const IngredientInput = ({ index, ingredient, onChange, onRemove, unitOptions }) => {
  const handleInputChange = (field, value) => {
    onChange(index, field, value);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 2, 
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      width: '100%',
      maxWidth: 1400,
    }}>
      <TextField
        sx={{ 
          flex: 2,
          '& label': {
            top: '12px !important',
            transform: 'translate(14px, 0) scale(0.75) !important',
          },
          '& .MuiInputBase-root': {
            height: 60,
            fontSize: '1rem',
            padding: '16px 24px',
          },
          '& .MuiInputBase-input': {
            padding: '16px 24px',
            fontSize: '1rem',
          },
        }}
        label="Nombre"
        value={ingredient.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        required
        fullWidth
      />
      
      <TextField
        sx={{ 
          flex: 1,
          '& label': {
            top: '12px !important',
            transform: 'translate(14px, 0) scale(0.75) !important',
          },
          '& .MuiInputBase-root': {
            height: 60,
            fontSize: '1rem',
            padding: '16px 24px',
          },
          '& .MuiInputBase-input': {
            padding: '16px 24px',
            fontSize: '1rem',
          },
        }}
        label="Cantidad"
        type="number"
        value={ingredient.quantity}
        onChange={(e) => handleInputChange('quantity', e.target.value)}
        required
        fullWidth
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <select
          value={ingredient.unit}
          onChange={(e) => handleInputChange('unit', e.target.value)}
          style={{
            height: 45,
            fontSize: '0.9rem',
            padding: '8px 20px',
            minWidth: 140,
          }}
        >
          {unitOptions.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        <IconButton
          onClick={onRemove}
          color="error"
          size="small"
        >
          <DeleteIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default IngredientInput;
