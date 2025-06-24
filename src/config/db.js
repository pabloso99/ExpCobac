require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('Por favor, configura la variable MONGODB_URI en tu archivo .env');
        }

        console.log('Intentando conectar a MongoDB...');
        
        const options = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('✅ Conectado a MongoDB Atlas');
        console.log('Estado de conexión:', mongoose.connection.readyState);
        console.log('Base de datos:', mongoose.connection.name);
        
        // Verificar si la base de datos existe y crearla si no
        const dbName = 'exp_cobac';
        console.log('Base de datos:', dbName);
        
        // Las colecciones se crearán automáticamente cuando se use el modelo
        // No es necesario crearlas manualmente
        console.log('Conexión a MongoDB establecida');
        
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
        console.error('Error detallado:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        // No salir del proceso, solo mostrar el error
        console.error('Reintentando conexión en 5 segundos...');
        setTimeout(connectDB, 5000);
    }
};

// Conectarse automáticamente al iniciar el servidor y manejar reconexiones
let isConnected = false;

const connectWithRetry = async () => {
    if (isConnected) return;
    try {
        await connectDB();
        isConnected = true;
    } catch (error) {
        console.error('Error al conectar:', error);
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

// Manejar reconexiones
mongoose.connection.on('disconnected', () => {
    console.log('Desconectado de MongoDB');
    isConnected = false;
    connectWithRetry();
});

mongoose.connection.on('error', (error) => {
    console.error('Error en la conexión:', error);
    isConnected = false;
    connectWithRetry();
});

module.exports = mongoose;
