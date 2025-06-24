import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      navigate('/profile');
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await authService.register(email, password);
      setUser(response.user);
      navigate('/profile');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = !!user;

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated,
  };
};
