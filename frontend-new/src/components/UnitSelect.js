import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

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

const UnitSelect = ({ value, onChange, label = 'U.M.' }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <FormControl sx={{ width: 100 }}>
      <InputLabel id={`unit-label`} shrink>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={handleChange}
        displayEmpty
        labelId={`unit-label`}
        inputProps={{
          name: 'unit',
          id: `unit-select`
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          },
          '& .MuiSelect-select': {
            padding: '6px 12px',
            fontSize: '0.8rem',
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

export default UnitSelect;
