import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin) {
        return <Navigate to="/recipes" />;
    }

    return children;
};

export default AdminRoute;
