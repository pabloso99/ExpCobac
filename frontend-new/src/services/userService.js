import api from './api';

const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener usuarios');
    }
};

const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al crear usuario');
    }
};

const updateUserRoles = async (userId, roles) => {
    try {
        const response = await api.put(`/users/${userId}/roles`, { roles });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar roles');
    }
};

const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar usuario');
    }
};

export const userService = {
    getUsers,
    createUser,
    updateUserRoles,
    deleteUser,
};
