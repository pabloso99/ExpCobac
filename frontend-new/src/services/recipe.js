import axios from 'axios';
import { RECIPES_URL } from '../config/api';

export const recipeService = {
  fetchRecipes: async () => {
    console.log('Intentando obtener recetas desde:', RECIPES_URL);
    try {
      const response = await axios.get(RECIPES_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Recetas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error detallado al obtener recetas:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  createRecipe: async (recipeData) => {
    console.log('Intentando crear receta:', recipeData);
    try {
      // Validar que la receta tenga al menos un ingrediente
      if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
        throw new Error('La receta debe tener al menos un ingrediente');
      }
      
      // Validar que cada salsa tenga al menos un ingrediente
      if (recipeData.sauces) {
        recipeData.sauces.forEach((sauce, index) => {
          if (!sauce.ingredients || sauce.ingredients.length === 0) {
            throw new Error(`La salsa ${index + 1} debe tener al menos un ingrediente`);
          }
        });
      }

      const response = await axios.post(RECIPES_URL, recipeData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Receta creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error detallado al crear receta:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  updateRecipe: async (id, recipeData) => {
    console.log('Intentando actualizar receta con ID:', id);
    try {
      // Validar que la receta tenga al menos un ingrediente
      if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
        throw new Error('La receta debe tener al menos un ingrediente');
      }
      
      // Validar que cada salsa tenga al menos un ingrediente
      if (recipeData.sauces) {
        recipeData.sauces.forEach((sauce, index) => {
          if (!sauce.ingredients || sauce.ingredients.length === 0) {
            throw new Error(`La salsa ${index + 1} debe tener al menos un ingrediente`);
          }
        });
      }

      const response = await axios.put(`${RECIPES_URL}/${id}`, recipeData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Receta actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error detallado al actualizar receta:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    console.log('Intentando eliminar receta con ID:', id);
    try {
      const response = await axios.delete(`${RECIPES_URL}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Receta eliminada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error detallado al eliminar receta:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }
};
