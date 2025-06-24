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
      <Box sx={{ flex: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>Nombre</Typography>
        <TextField
          value={ingredient.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          fullWidth
          sx={{
            '& .MuiInputBase-root': {
              height: 40,
              fontSize: '1rem',
              padding: '8px 16px',
            },
            '& .MuiInputBase-input': {
              padding: '8px 16px',
              fontSize: '1rem',
            },
          }}
        />
      </Box>
      
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>Cantidad</Typography>
        <TextField
          type="number"
          value={ingredient.quantity}
          onChange={(e) => handleInputChange('quantity', e.target.value)}
          required
          fullWidth
          sx={{
            '& .MuiInputBase-root': {
              height: 40,
              fontSize: '1rem',
              padding: '8px 16px',
            },
            '& .MuiInputBase-input': {
              padding: '8px 16px',
              fontSize: '1rem',
            },
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <select
          value={ingredient.unit}
          onChange={(e) => handleInputChange('unit', e.target.value)}
          style={{
            height: 40,
            fontSize: '0.9rem',
            padding: '8px 16px',
            minWidth: 120,
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
