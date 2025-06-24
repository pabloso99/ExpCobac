import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography } from '@mui/material';

const LabelOutsideSelect = ({ label, value, onChange, options, sx = {}, ...props }) => {
  return (
    <Box sx={{ mb: 2, ...sx }}>
      <Typography variant="body2" sx={{ 
        mb: 1,
        color: 'text.secondary',
      }}>
        {label}
      </Typography>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={onChange}
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
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LabelOutsideSelect;
