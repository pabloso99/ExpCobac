import api from './api';
import { USERS_URL } from '../config/api';

export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener usuarios');
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al crear usuario');
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar el rol');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al eliminar usuario');
    }
  },
};
