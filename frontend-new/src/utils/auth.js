import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = useCallback(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email, password) => {
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);

      // Lógica de redirección por rol
      if (loggedInUser.roles.includes('admin') || loggedInUser.roles.includes('chef') || loggedInUser.roles.includes('user')) {
        navigate('/recipes');
      } else if (loggedInUser.roles.includes('produc')) {
        navigate('/production');
      } else {
        navigate('/profile'); // Página por defecto si no tiene un rol principal
      }

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email, password) => {
    await authService.register(email, password);
    await login(email, password);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const hasRole = useCallback((role) => {
    return user && user.roles && user.roles.includes(role);
  }, [user]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: hasRole('admin'),
    isChef: hasRole('chef'),
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
