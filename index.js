// Importaciones
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuración inicial
dotenv.config();

// Crear aplicación
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tranquil-fudge-e45f27.netlify.app',
    'https://gregarious-brioche-9c80d9.netlify.app',
    'https://lucky-jalebi-181316.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-new-token'],
  exposedHeaders: ['x-new-token']
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://pablo:123@cluster1.hfar4lf.mongodb.net/exp_cobac';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error);
    process.exit(1);
  }
};

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const startServer = async () => {
  try {
    console.log('🔍 Starting server...');
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Rutas
    console.log('--- Cargando rutas principales ---');
    app.use('/api/auth', require('./src/routes/auth'));
    console.log('✔️ Ruta /api/auth montada');
    
    app.use('/api/recipes', require('./src/routes/recipes'));
    console.log('✔️ Ruta /api/recipes montada');
    
    app.use('/api/sauces', require('./src/routes/sauceRoutes'));
    console.log('✔️ Ruta /api/sauces montada');
    
    const usersRouter = require('./src/routes/users');
    console.log('✔️ Users router importado');
    app.use('/api/users', usersRouter);
    console.log('✔️ Ruta /api/users montada');
    console.log('--- Fin de carga de rutas principales ---');

    // Ruta de prueba para verificar que el servidor está funcionando
    app.get('/api/test', (req, res) => {
      console.log('✅ Test route hit');
      res.json({ message: 'Servidor funcionando correctamente' });
    });

    // Ruta de prueba para verificar conexión a MongoDB
    app.get('/api/test-db', async (req, res) => {
      try {
        console.log('🔍 Testing MongoDB connection...');
        const count = await mongoose.connection.db.collection('recipes').countDocuments();
        console.log(`✅ MongoDB connection successful. Found ${count} recipes.`);
        res.json({ success: true, recipeCount: count });
      } catch (error) {
        console.error('❌ MongoDB test failed:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Error handling
    app.use((err, req, res, next) => {
      console.error('Error global:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log('🌐 Network URL:', `http://${require('os').hostname()}:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar aplicación
startServer();
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  console.error('Método:', req.method);
  console.error('URL:', req.url);
  console.error('=== Fin del error ===\n');
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: err.message 
  });
});

// Manejar rutas no encontradas
app.use((req, res) => {
  console.log('\n=== Ruta no encontrada ===');
  console.log('Método:', req.method);
  console.log('URL:', req.url);
  console.log('=== Fin de ruta no encontrada ===\n');
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `No se encontró la ruta ${req.method} ${req.url}`
  });
});

const PORT = process.env.PORT || 5000;

// Verificar si el puerto está disponible
const checkPort = async () => {
  try {
    const response = await fetch(`http://localhost:${PORT}`);
    console.log('El puerto está ocupado:', response.status);
  } catch (error) {
    console.log('El puerto está disponible');
  }
};

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Estado de MongoDB:', mongoose.connection.readyState);
  console.log('Conectado a MongoDB:', mongoose.connection.readyState === 1 ? 'Sí' : 'No');
  
  // Verificar si el servidor responde
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      collections: mongoose.connection.db ? mongoose.connection.db.collections() : []
    });
  });

  // Verificar la conexión cada 5 segundos
  setInterval(() => {
    console.log('Estado de conexión:', mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
      console.log('Intentando reconectar...');
      connectWithRetry();
    }
  }, 5000);
});

// Manejar errores de conexión
server.on('error', (error) => {
  console.error('\n=== Error del servidor ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('========================\n');
});

// Verificar el puerto al iniciar
checkPort();
