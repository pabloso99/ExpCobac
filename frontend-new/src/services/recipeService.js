import axios from 'axios';

import { RECIPES_URL } from '../config/api';
const RECIPES_API_URL = RECIPES_URL;

export const recipeService = {
  fetchRecipes: async () => {
    try {
      const response = await axios.get(`${RECIPES_API_URL}/`);
      console.log('Respuesta de fetchRecipes:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error en fetchRecipes:', error);
      throw error;
    }
  },

  getAllSauces: async () => {
    try {
      const response = await axios.get(`${RECIPES_API_URL}/sauces`);
      console.log('Respuesta de getAllSauces:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cargar salsas:', error);
      throw error;
    }
  },

  createSauce: async (sauceData) => {
    try {
      const response = await axios.post(`${RECIPES_API_URL}/sauces`, sauceData);
      return response.data;
    } catch (error) {
      console.error('Error al crear salsa:', error);
      throw error;
    }
  },

  fetchSauce: async (id) => {
    try {
      const response = await axios.get(`${RECIPES_API_URL}/sauces/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al cargar salsa:', error);
      throw error;
    }
  },

  updateSauce: async (id, sauceData) => {
    try {
      const response = await axios.put(`${RECIPES_API_URL}/sauces/${id}`, sauceData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar salsa:', error);
      throw error;
    }
  },

  deleteSauce: async (id) => {
    try {
      await axios.delete(`${RECIPES_API_URL}/sauces/${id}`);
    } catch (error) {
      console.error('Error al eliminar salsa:', error);
      throw error;
    }
  },

  createRecipe: async (recipeData) => {
    try {
      console.log('Datos enviados al backend:', recipeData);
      const response = await axios.post(`${RECIPES_API_URL}`, recipeData);
      return response.data;
    } catch (error) {
      console.error('Error en createRecipe:', error);
      throw error;
    }
  },

  updateRecipe: async (id, recipeData) => {
    try {
      console.log('Datos enviados al backend:', recipeData);
      const response = await axios.put(`${RECIPES_API_URL}/${id}`, recipeData);
      return response.data;
    } catch (error) {
      console.error('Error en updateRecipe:', error);
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    try {
      await axios.delete(`${RECIPES_API_URL}/${id}`);
    } catch (error) {
      console.error('Error en deleteRecipe:', error);
      throw error;
    }
  }
};
