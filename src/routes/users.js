const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Proteger todas las rutas de este archivo con autenticación y rol de administrador
router.use(verifyToken, isAdmin);

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        let users = await User.find().select('-password');
        if (!users) {
            console.error('[users.js] No se encontraron usuarios');
            return res.status(404).json({ error: 'No se encontraron usuarios' });
        }

        // Migración de datos para usuarios antiguos
        const migratedUsers = users.map(user => {
            console.log('Procesando usuario:', user);
            const userObj = user.toObject();
            if (!userObj.roles || userObj.roles.length === 0) {
                userObj.roles = [userObj.role || 'user'];
            }
            return userObj;
        });

        return res.json(migratedUsers);
    } catch (error) {
        console.error('[users.js] Error al obtener usuarios:', error);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }
});

// Ruta para crear un nuevo usuario (desde el panel de admin)
router.post('/', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const user = new User({ email, password, role });
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json(userResponse);
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Ruta para actualizar el rol de un usuario
router.put('/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol' });
    }
});

// Ruta para eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        if (req.user.userId === req.params.id) {
            return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

// Update user roles (admin only)
router.put('/:id/roles', async (req, res) => {
    // En una aplicación real, aquí habría un middleware para verificar que el usuario que hace la petición es admin
    try {
        const { roles } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.roles = roles;
        await user.save();
        res.json(user);

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar roles', error: error.message });
    }
});

module.exports = router;
