require('dotenv').config();
const mongoose = require('mongoose');

// Conectarse a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority'
});

// Definir el schema del usuario
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Crear el modelo
const User = mongoose.model('User', userSchema);

// Crear un usuario de prueba
const createUser = async () => {
    try {
        const user = new User({
            email: 'test@example.com',
            password: 'test123'
        });
        
        await user.save();
        console.log('Usuario creado exitosamente:', user);
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }
};

// Ejecutar la prueba
createUser();
