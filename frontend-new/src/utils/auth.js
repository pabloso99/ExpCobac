import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Log user state changes for debugging
  useEffect(() => {
    console.log('[AuthContext] User state changed:', user);
  }, [user]);

  // Check auth status on initial load
  useEffect(() => {
    console.log('[AuthContext] Initializing auth state...');
    const currentUser = authService.getCurrentUser();
    console.log('[AuthContext] User from token on load:', currentUser);
    setUser(currentUser);
    setLoading(false);
    console.log('[AuthContext] Auth state initialized.');
  }, []);

  const login = async (email, password) => {
    console.log('[AuthContext] Attempting login...');
    try {
      const response = await authService.login(email, password);
      console.log('[AuthContext] Login response:', response);
      
      if (response) {
        // Get current token from localStorage
        const currentToken = localStorage.getItem('token');
        console.log('[AuthContext] Current token in localStorage:', currentToken);
        
        // Decode current token
        let decodedToken;
        try {
          decodedToken = jwtDecode(currentToken);
          console.log('[AuthContext] Decoded token from localStorage:', decodedToken);
          console.log('[AuthContext] Token role:', decodedToken?.role);
        } catch (decodeError) {
          console.error('[AuthContext] Error decoding token from localStorage:', decodeError);
        }
        
        // Ensure we have a role property
        const userWithRole = {
          ...response,
          role: response.role || decodedToken?.role || 'user', // Prioritize response role
          email: response.email || decodedToken?.email || 'unknown',
          userId: response.userId || decodedToken?.userId
        };
        
        // Log full user object before setting
        console.log('[AuthContext] Setting user state:', userWithRole);
        setUser(userWithRole);
        
        // Wait for state update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Log after setting state
        console.log('[AuthContext] User state after set:', user);
        console.log('[AuthContext] isAdmin state:', userWithRole.role === 'admin');
        console.log('[AuthContext] Navigating to /recipes...');
        navigate('/recipes');
      } else {
        console.error('[AuthContext] CRITICAL: Login failed to return user info');
      }
    } catch (error) {
      console.error('[AuthContext] CRITICAL: Login function caught an error:', error);
      throw error;
    }
  };

  const register = async (email, password) => {
    await authService.register(email, password);
    await login(email, password); // Auto-login after registration
  };

  const logout = () => {
    console.log('[AuthContext] Logging out...');
    authService.logout();
    setUser(null);
    navigate('/login');
    console.log('[AuthContext] Logged out and navigated to /login.');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: !!user && user.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
