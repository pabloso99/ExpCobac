import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const CustomInput = ({ label, value, onChange, required = false, error = false, helperText = '', sx = {} }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
      <TextField
        value={value}
        onChange={onChange}
        required={required}
        error={error}
        helperText={helperText}
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
          ...sx,
        }}
      />
    </Box>
  );
};

export default CustomInput;
