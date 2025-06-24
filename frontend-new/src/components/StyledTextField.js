import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const StyledTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 0) scale(0.75) !important',
    top: '12px !important',
    left: '14px !important',
    color: 'rgba(0, 0, 0, 0.54) !important',
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
});

const StyledInput = ({ label, ...props }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
      <StyledTextField {...props} />
    </Box>
  );
};

export default StyledInput;
