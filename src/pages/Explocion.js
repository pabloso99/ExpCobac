import React from 'react';
import { Typography, Box, Paper, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
}));

function Explocion() {
  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <StyledPaper>
            <Box sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                }}
              >
                E
              </Avatar>
            </Box>
            <Typography component="h1" variant="h4" gutterBottom>
              Explocion
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Explocion;
