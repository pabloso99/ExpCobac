const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Usar la misma configuración de conexión que en el servidor
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pablo:123@cluster1.hfar4lf.mongodb.net/exp_cobac';
const ADMIN_EMAIL = 'admin@cobac.com';

async function updateAdminRole() {
  try {
    console.log('Conectando a MongoDB...');
    
    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Conectado a MongoDB');

    // Verificar si el usuario existe
    let user = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!user) {
      console.error(`❌ Usuario con email ${ADMIN_EMAIL} no encontrado`);
      await mongoose.connection.close();
      return process.exit(1);
    }

    console.log('🔍 Usuario encontrado:', {
      email: user.email,
      role: user.role,
      id: user._id
    });

    // Actualizar el rol a admin
    user.role = 'admin';
    await user.save();

    // Verificar la actualización
    user = await User.findOne({ email: ADMIN_EMAIL });
    
    console.log('✅ Usuario actualizado a admin:', {
      email: user.email,
      role: user.role,
      id: user._id
    });

    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar el rol del usuario:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Ejecutar la función
updateAdminRole();
