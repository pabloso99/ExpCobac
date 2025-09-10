const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const user = new User({ email, password });
        await user.save();

        const tokenPayload = { userId: user._id, roles: user.roles };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ token, user: userResponse });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        let needsSave = false;
        if (user.email === 'admin@cobac.com' && !user.roles.includes('admin')) {
            user.roles.push('admin');
            needsSave = true;
        }

        if (needsSave) {
            await user.save();
            user = await User.findById(user._id); // Recargar para obtener la versión más reciente
        }

        const tokenPayload = { userId: user._id, roles: user.roles };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ token, user: userResponse });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Verificar el token y devolver la información del usuario
router.get('/verify', verifyToken, (req, res) => {
    try {
        const userResponse = req.user.toObject();
        delete userResponse.password;
        res.json({ user: userResponse });
    } catch (error) {
        console.error('Error en verificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener perfil de usuario
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const profile = await User.findById(req.user._id).select('-password');
        if (!profile) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error en perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

router.put('/profile', verifyToken, async (req, res) => {
    try {
        const updates = {};
        const allowedUpdates = ['email', 'password'];
        const updatesKeys = Object.keys(req.body);

        updatesKeys.forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error en actualización de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
});

module.exports = router;
