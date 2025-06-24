import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, Button } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Explocion from './pages/Explocion';
import Recipes from '../frontend-new/src/pages/Recipes';
import Navbar from './components/Navbar';
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
      <Navbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 8 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/explocion"
            element={
              isAuthenticated ? (
                <Explocion />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/recipes"
            element={
              isAuthenticated ? (
                <Recipes />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/profile" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
