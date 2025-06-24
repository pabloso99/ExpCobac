import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const LabelledInput = ({ label, value, onChange, required = false, error = false, helperText = '', sx = {}, ...props }) => {
  return (
    <Box sx={{ 
      mb: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      ...sx,
    }}>
      <Typography variant="body2" sx={{ 
        color: required ? 'error.main' : 'text.secondary',
        fontWeight: required ? 'bold' : 'normal',
      }}>
        {label}
      </Typography>
      <TextField
        value={value}
        onChange={onChange}
        required={required}
        error={error}
        helperText={helperText}
        fullWidth
        InputProps={{
          sx: {
            '& input': {
              height: 40,
              fontSize: '1rem',
              padding: '12px 16px',
            },
          },
        }}
        {...props}
      />
    </Box>
  );
};

export default LabelledInput;
