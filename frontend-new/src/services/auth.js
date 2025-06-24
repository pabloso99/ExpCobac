import axios from 'axios';
import { AUTH_URL } from '../config/api';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// Use AUTH_URL from config for all auth routes
const AUTH_BASE_URL = AUTH_URL;

// Configurar axios con interceptores para manejar errores
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error de API:', error);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
      console.error('Código de estado:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (email, password) => {
    try {
      console.log('Intentando registrar usuario:', { email });
      const response = await axios.post(`${AUTH_BASE_URL}/register`, {
        email,
        password,
      });
      console.log('Respuesta de registro:', response.data);
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode(token);
      return { token, user: decodedUser };
    } catch (error) {
      console.error('Error en registro:', error);
      throw new Error(error.response?.data?.error || 'Error al registrarse');
    }
  },

  login: async (email, password) => {
    console.log('[Auth Service] Iniciando sesión con:', { email });
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/login`, { email, password });
      
      if (response.data && response.data.token) {
        const { token, user: userData } = response.data;
        
        // Guardar el token en localStorage
        localStorage.setItem('token', token);
        
        // Decodificar el token para obtener la información del usuario
        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
          console.log('[Auth Service] Token decodificado:', decodedToken);
        } catch (error) {
          console.error('[Auth Service] Error decodificando token:', error);
          throw new Error('Error al procesar la sesión');
        }
        
        // Crear objeto de usuario con la información del token y la respuesta
        const user = {
          userId: userData?.id || decodedToken?.userId,
          email: userData?.email || decodedToken?.email || email,
          role: userData?.role || decodedToken?.role || 'user',
          iat: decodedToken?.iat,
          exp: decodedToken?.exp
        };
        
        // Forzar el rol a admin para el usuario específico
        if (email === 'admin@cobac.com') {
          console.log('[Auth Service] Usuario admin detectado, forzando rol a admin');
          user.role = 'admin';
        }
        
        console.log('[Auth Service] Usuario autenticado:', user);
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        return user;
      }
      
      throw new Error('No se recibió un token válido');
    } catch (error) {
      console.error('[Auth Service] Error en login:', error);
      throw error;
    }
  },

  logout: () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    // First try to get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Force admin role for specific user
        if (user.email === 'admin@cobac.com') {
          user.role = 'admin';
          localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }

    // Fall back to token if user not in localStorage
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const user = {
        userId: decoded.userId,
        email: decoded.email || 'unknown',
        role: decoded.role || 'user',
        iat: decoded.iat,
        exp: decoded.exp
      };

      // Force admin role for specific user
      if (user.email === 'admin@cobac.com') {
        user.role = 'admin';
      }

      // Save to localStorage for next time
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    // Si el token no incluye el rol, asumimos que no es admin
    return !!user && user.role === 'admin';
  },
};
