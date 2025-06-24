const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const User = require('../models/User');

// Middleware de autenticación
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Por favor, inicia sesión' });
    }
};

// Registro
router.post('/register', [
    check('email', 'Email inválido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Crear nuevo usuario
        const user = new User({ email, password });
        await user.save();
        
        // Generar token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', [
    check('email', 'Email inválido').isEmail(),
    check('password', 'La contraseña es requerida').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta protegida
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Bienvenido a tu perfil', user });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

module.exports = router;
