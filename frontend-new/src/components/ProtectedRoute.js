import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const hasRequiredRole = user.roles && user.roles.some(role => allowedRoles.includes(role));

    if (!hasRequiredRole) {
        // Redirigir a una página de 'no autorizado' o a la página principal
        return <Navigate to="/recipes" replace />;
    }

    return children;
};

export default ProtectedRoute;
