import React from 'react';
import { Box, TextField } from '@mui/material';

const SimpleInput = ({ label, value, onChange, required = false, error = false, helperText = '', sx = {} }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        required={required}
        error={error}
        helperText={helperText}
        fullWidth
        sx={{
          '& .MuiInputLabel-root': {
            transform: 'translate(14px, 0) scale(0.75)',
            top: '12px',
            left: '14px',
            color: 'rgba(0, 0, 0, 0.54)',
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
          ...sx,
        }}
      />
    </Box>
  );
};

export default SimpleInput;
