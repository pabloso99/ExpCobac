const mongoose = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        // Verificar si ya existe un usuario admin
        const existingAdmin = await User.findOne({ email: 'admin@cobac.com' });
        if (existingAdmin) {
            console.log('Usuario admin ya existe. Verificando rol...');
            console.log('Rol actual:', existingAdmin.role);
            // Si existe pero no tiene rol, actualizarlo
            if (!existingAdmin.role) {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Rol actualizado a admin');
            }
            return;
        }

        // Creamos el usuario admin
        const admin = new User({
            email: 'admin@cobac.com',
            password: await bcrypt.hash('123456', 10),
            role: 'admin'
        });

        await admin.save();
        console.log('Usuario administrador creado exitosamente');
        console.log('Rol asignado:', admin.role);
        
        // Verificar el usuario creado
        const createdAdmin = await User.findOne({ email: 'admin@cobac.com' });
        console.log('Verificación final:', {
            email: createdAdmin.email,
            role: createdAdmin.role,
            id: createdAdmin._id
        });
    } catch (error) {
        console.error('Error al crear usuario administrador:', error);
        process.exit(1);
    }
}

// Ejecutar la función
createAdmin();
