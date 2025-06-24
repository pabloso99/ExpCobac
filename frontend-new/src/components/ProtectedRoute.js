import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>; // O un componente de spinner más elegante
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
