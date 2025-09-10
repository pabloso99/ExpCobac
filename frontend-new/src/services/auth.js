import axios from 'axios';
import { AUTH_URL } from '../config/api';

const login = async (email, password) => {
    try {
        const response = await axios.post(`${AUTH_URL}/login`, { email, password });
        if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        throw new Error('Respuesta de login inválida');
    } catch (error) {
        console.error('Error en login:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error de red');
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error('Error al parsear usuario desde localStorage:', e);
        logout();
        return null;
    }
};

const register = async (email, password) => {
    try {
        const response = await axios.post(`${AUTH_URL}/register`, { email, password });
        if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        throw new Error('Respuesta de registro inválida');
    } catch (error) {
        console.error('Error en registro:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error de red');
    }
};

export const authService = {
    login,
    logout,
    getCurrentUser,
    register,
};
