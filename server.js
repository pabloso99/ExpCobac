const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://cobac.netlify.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error);
    process.exit(1); // Salir del proceso con error
  }
};

// Cargar Rutas
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/recipes', require('./src/routes/recipes'));
app.use('/api/sauces', require('./src/routes/sauceRoutes'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/ingredients', require('./src/routes/ingredients'));
app.use('/api/production', require('./src/routes/production'));

// Iniciar el servidor después de conectar a la DB
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  });
};

startServer();