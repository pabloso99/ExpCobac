const mongoose = require('../config/db');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware para establecer el rol al crear un nuevo usuario
userSchema.pre('save', function(next) {
    if (this.isNew && !this.role) {
        // Si es un nuevo usuario y no tiene rol asignado, se establece como 'user'
        this.role = 'user';
        console.log(`[User Model] Asignando rol por defecto: ${this.role} a usuario ${this.email}`);
    } else {
        console.log(`[User Model] Usuario ${this.email} tiene rol: ${this.role}`);
    } 
    next();
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
