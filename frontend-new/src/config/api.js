export const BASE_URL = process.env.REACT_APP_API_URL || 'https://expcobac.onrender.com';
export const API_URL = `${BASE_URL}/api`;
export const AUTH_URL = `${API_URL}/auth`;
export const RECIPES_URL = `${API_URL}/recipes`;
export const SAUCES_URL = `${API_URL}/sauces`;
export const USERS_URL = `${API_URL}/users`;

// Configuración de CORS para desarrollo
export const CORS_ORIGIN = 'http://localhost:3001';
