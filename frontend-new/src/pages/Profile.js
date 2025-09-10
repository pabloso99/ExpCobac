import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Debug: mostrar el estado del usuario en la consola
  console.log('Usuario en Profile:', user);

  const getWelcomeMessage = () => {
    if (!user || !user.roles) return 'Bienvenido';
    if (user.roles.includes('admin')) return 'Bienvenido, Administrador';
    if (user.roles.includes('chef')) return 'Bienvenido, Chef';
    if (user.roles.includes('produc')) return 'Bienvenido, Producción';
    if (user.roles.includes('compras')) return 'Bienvenido, Compras';
    if (user.roles.includes('almacen')) return 'Bienvenido, Almacén';
    return 'Bienvenido';
  };

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
          {getWelcomeMessage()}
        </Typography>
        <Card sx={{ maxWidth: 500, mt: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Typography variant="h6">Email: {user?.email}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Roles: {(user?.roles || []).join(', ')}
                  </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Profile;
