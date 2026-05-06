const express = require('express');
const cors = require('cors'); // Asegúrate de tener esta línea
const { connectToDatabase } = require('./db');
const usuariosRoutes = require('./routes/usuarios');
const motosRoutes = require('./routes/motos');
const parqueaderosRoutes = require('./routes/parqueaderos');
const reservasRoutes = require('./routes/reservas');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONFIGURACIÓN DE CORS (Puerta abierta para el Frontend)
// ==========================================
app.use(cors({
  origin: [
    'https://parqueaderoapp-frontend.onrender.com', // Tu URL de producción
    'http://localhost:5173',                       // Tu URL local de desarrollo
    'http://localhost:8100'                        // URL local de Ionic
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
} ));

app.use(express.json());

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/motos', motosRoutes);
app.use('/parqueaderos', parqueaderosRoutes);
app.use('/reservas', reservasRoutes);

app.get('/', (req, res) => {
  res.send('Servidor de Parqueadero UCC funcionando 🚀');
});

// Conexión a DB y encendido
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error inicializando:', err);
    // Si la DB falla, igual levantamos para el modo prueba
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT} (Modo prueba sin DB)`);
    });
  });
