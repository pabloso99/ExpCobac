import React from 'react';
import { Select, MenuItem } from '@mui/material';

const units = [
  { value: 'g', label: 'Gramos' },
  { value: 'kg', label: 'Kilogramos' },
  { value: 'ml', label: 'Mililitros' },
  { value: 'l', label: 'Litros' },
  { value: 'und', label: 'Unidades' },
  { value: 'taza', label: 'Tazas' },
  { value: 'cucharada', label: 'Cucharadas' },
  { value: 'cucharadita', label: 'Cucharaditas' }
];

const UnitSelect = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      sx={{ width: 120 }}
    >
      {units.map(unit => (
        <MenuItem key={unit.value} value={unit.value}>
          {unit.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default UnitSelect;
