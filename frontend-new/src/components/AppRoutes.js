import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Recipes from '../pages/Recipes';
import AdminUsers from '../pages/AdminUsers';

// Components
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import { useAuth } from '../utils/auth';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/recipes" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/recipes" replace />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <Recipes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/recipes" : "/login"} replace />
            }
          />
        </Routes>
      </Container>
    </>
  );
};

export default AppRoutes;
