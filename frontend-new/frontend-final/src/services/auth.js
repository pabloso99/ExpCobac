import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const authService = {
  register: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al registrarse');
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded;
    } catch (error) {
      return null;
    }
  },
};
