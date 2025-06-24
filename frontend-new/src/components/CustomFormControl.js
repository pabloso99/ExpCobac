import React from 'react';
import { Box, FormControl, InputLabel, OutlinedInput, Typography } from '@mui/material';

const CustomFormControl = ({ label, value, onChange, required = false, error = false, helperText = '', sx = {}, ...props }) => {
  return (
    <Box sx={{ mb: 2, ...sx }}>
      <Typography variant="body2" sx={{ 
        mb: 1,
        color: required ? 'error.main' : 'text.secondary',
        fontWeight: required ? 'bold' : 'normal',
      }}>
        {label}
      </Typography>
      <FormControl
        fullWidth
        error={error}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 40,
            '& fieldset': {
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderWidth: '1px',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            },
          },
        }}
      >
        <OutlinedInput
          value={value}
          onChange={onChange}
          required={required}
          {...props}
        />
        {helperText && (
          <Typography variant="caption" sx={{ mt: 1, color: error ? 'error.main' : 'text.secondary' }}>
            {helperText}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
};

export default CustomFormControl;
