import React from 'react';
import { Box, Typography, MenuItem, Select, FormControl } from '@mui/material';

export const units = [
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
  { value: 'l', label: 'l' },
  { value: 'taza', label: 'taza' },
  { value: 'cda', label: 'cda' },
  { value: 'cdita', label: 'cdita' },
  { value: 'u', label: 'u' },
  { value: 'pza', label: 'pza' },
];

const UnitSelector = ({ value, onChange, sx = {} }) => {
  const units = [
    { value: 'g', label: 'g' },
    { value: 'kg', label: 'kg' },
    { value: 'ml', label: 'ml' },
    { value: 'l', label: 'l' },
    { value: 'taza', label: 'taza' },
    { value: 'cda', label: 'cda' },
    { value: 'cdita', label: 'cdita' },
    { value: 'u', label: 'u' },
    { value: 'pza', label: 'pza' },
  ];
  return (
    <Box sx={{ mb: 2, ...sx }}>
      <Typography variant="body2" sx={{ 
        mb: 1,
        color: 'text.secondary',
      }}>
        U.M.
      </Typography>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 40,
              borderRadius: 1,
            },
            '& .MuiSelect-select': {
              padding: '0 16px',
              fontSize: '0.9rem',
            },
          }}
        >
          {units.map((unit) => (
            <MenuItem key={unit.value} value={unit.value}>
              {unit.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default UnitSelector;
