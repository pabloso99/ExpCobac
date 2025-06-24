const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware to verify JWT
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado en middleware:', decoded);

        if (!decoded.userId) {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!user.role) {
            console.error('Usuario sin rol en la base de datos:', user);
            return res.status(500).json({ error: 'User without role' });
        }

        // Actualizar el token con toda la información del usuario
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000)
        };
        const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.setHeader('x-new-token', newToken);
        req.user = user.toObject();
        req.user.role = user.role;
        return next();
    } catch (error) {
        console.error('Error in verifyToken middleware:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to check for admin role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};

module.exports = { verifyToken, isAdmin };
