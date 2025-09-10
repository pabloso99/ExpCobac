import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const units = [
  { value: 'ml', label: 'ml' },
  { value: 'lt', label: 'lt' }
];

export default function SauceAmountUnitSelect({ amount, unit, onAmountChange, onUnitChange }) {
  return (
    <>
      <TextField
        label="Cantidad"
        type="number"
        value={amount}
        onChange={e => onAmountChange(e.target.value)}
        sx={{ width: 100, mr: 1 }}
        inputProps={{ min: 0, step: 'any' }}
      />
      <TextField
        select
        label="Unidad"
        value={unit}
        onChange={e => onUnitChange(e.target.value)}
        sx={{ width: 80 }}
      >
        {units.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
