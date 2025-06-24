// Importaciones
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');
require('dotenv').config();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Rutas de autenticación
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        const user = new User({ email, password });
        await user.save();

        // Generar token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

router.get('/test', (req, res) => {
    try {
        res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
    } catch (error) {
        console.error('Error en prueba:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/verify', verifyToken, (req, res) => {
    try {
        res.json({ user: req.user });
    } catch (error) {
        console.error('Error en verificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log(`[Auth] Intento de login para: ${email}`);
        
        // Buscar usuario por email
        let user = await User.findOne({ email });
        
        if (!user) {
            console.log(`[Auth] Usuario no encontrado: ${email}`);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`[Auth] Contraseña incorrecta para: ${email}`);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Recargar el usuario para asegurar que tenemos los datos más recientes
        user = await User.findById(user._id).lean();
        
        // Asegurarse de que el rol es válido
        if (!user.role || !['user', 'admin'].includes(user.role)) {
            console.log(`[Auth] Rol no válido para ${email}, estableciendo como 'user'`);
            user.role = 'user';
            await User.findByIdAndUpdate(user._id, { role: 'user' });
        } else {
            console.log(`[Auth] Usuario ${email} tiene rol:`, user.role);
        }

        // Forzar el rol a 'admin' para propósitos de prueba
        if (email === 'admin@cobac.com') {
            console.log('[Auth] Usuario admin detectado, forzando rol a admin');
            user.role = 'admin';
        }

        // Crear payload del token
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000)
        };

        console.log('[Auth] Payload del token:', JSON.stringify(tokenPayload, null, 2));

        // Generar token
        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`[Auth] Token generado para ${email} con rol: ${user.role}`);

        // Enviar respuesta
        res.json({ 
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const user = new User({ email, password });
        await user.save();

        // Ensure role is set
        if (!user.role) {
            user.role = 'user';
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

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
