import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Debug: mostrar el estado del usuario en la consola
  console.log('Usuario en Profile:', user);

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Bienvenido
        </Typography>
        <Card sx={{ maxWidth: 500, mt: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Profile;
