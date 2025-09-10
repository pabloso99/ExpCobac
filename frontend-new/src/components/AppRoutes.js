import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Recipes from '../pages/Recipes';
import AdminUsers from '../pages/AdminUsers';
import Ingredients from '../pages/Ingredients';
import Explosion from '../pages/Explosion';
import Production from '../pages/Production';
import Costs from '../pages/Costs';

// Components
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../utils/auth';

const AppRoutes = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <>
      {isAuthenticated && <Navbar user={user} />}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/recipes" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/recipes" replace />} />

          <Route path="/profile" element={<ProtectedRoute allowedRoles={['user', 'chef', 'admin']}><Profile /></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute allowedRoles={['user', 'chef', 'admin']}><Recipes /></ProtectedRoute>} />
          
          <Route path="/ingredients" element={<ProtectedRoute allowedRoles={['compras', 'almacen', 'chef', 'admin']}><Ingredients /></ProtectedRoute>} />
          <Route path="/explosion" element={<ProtectedRoute allowedRoles={['chef', 'admin']}><Explosion /></ProtectedRoute>} />
          <Route path="/production" element={<ProtectedRoute allowedRoles={['almacen', 'produc', 'chef', 'admin']}><Production /></ProtectedRoute>} />
          
          <Route path="/costs" element={<ProtectedRoute allowedRoles={['compras', 'chef', 'admin']}><Costs /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to={isAuthenticated ? "/recipes" : "/login"} replace />} />
        </Routes>
      </Container>
    </>
  );
};

export default AppRoutes;
