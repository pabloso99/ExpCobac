import axios from 'axios';
import { API_URL } from '../config';

const SAUCES_API_URL = `${API_URL}/sauces`;

export const sauceService = {
  createSauce: async (sauceData) => {
    try {
      const response = await axios.post(SAUCES_API_URL, sauceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSauce: async (sauceId, sauceData) => {
    try {
      const response = await axios.put(`${SAUCES_API_URL}/${sauceId}`, sauceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSauces: async (sauceIds) => {
    try {
      const response = await axios.get(`${SAUCES_API_URL}?ids=${sauceIds.join(',')}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllSauces: async () => {
    try {
      const response = await axios.get(SAUCES_API_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
