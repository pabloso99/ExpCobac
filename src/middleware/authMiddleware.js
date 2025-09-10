const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) return res.status(401).json({ error: 'Invalid token format' });

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ error: 'User not found' });

        // Migración de datos para usuarios antiguos
        if (!user.roles || user.roles.length === 0) {
            user.roles = [user.role || 'user'];
            await user.save();
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Error in verifyToken middleware:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.roles.includes('admin')) {
        return next();
    }
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
};

module.exports = { verifyToken, isAdmin };
