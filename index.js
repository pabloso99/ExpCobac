require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

console.log('Iniciando servidor...');

// Middleware
app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400
}));

app.use((req, res, next) => {
  console.log('\n=== Solicitud recibida ===');
  console.log('Método:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('=== Fin de solicitud ===\n');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar la base de datos
require('./src/config/db');

// Rutas
console.log('Cargando rutas...');
try {
  const authRoutes = require('./src/routes/auth');
  const recipeRoutes = require('./src/routes/recipes');
  
  // Ruta de prueba
  app.get('/', (req, res) => {
    console.log('Accediendo a la ruta de prueba');
    res.json({ message: 'API está funcionando' });
  });

  // Rutas de la API
  app.use('/api/auth', authRoutes);
  app.use('/api/recipes', recipeRoutes);
  
  console.log('Rutas cargadas exitosamente');
} catch (error) {
  console.error('Error al cargar las rutas:', error);
  process.exit(1);
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('\n=== Error en el servidor ===');
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
