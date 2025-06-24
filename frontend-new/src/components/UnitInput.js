import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';

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

const UnitInput = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <Select
        value={value || 'g'}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          },
          '& .MuiSelect-select': {
            padding: '8px 16px',
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
  );
};

export default UnitInput;
