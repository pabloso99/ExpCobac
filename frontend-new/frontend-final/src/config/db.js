require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        };

        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
        process.exit(1);
    }
};

// Conectarse automáticamente al iniciar el servidor
connectDB();

module.exports = mongoose;
