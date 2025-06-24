import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, Button } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { useAuth } from './utils/auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sistema de Autenticación
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  isAuthenticated ? <Profile /> : <Navigate to="/login" />
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
