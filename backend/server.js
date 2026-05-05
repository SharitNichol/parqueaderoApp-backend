const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./db");
const app = express();

// Configuración CORS: permite peticiones desde el frontend local y móvil
const corsOptions = {
  origin: [
    "http://localhost:8100",   // Ionic dev server
    "http://localhost:3000",   // Posible frontend en producción local
    "http://localhost:5173",   // Vite dev server
    "capacitor://localhost",   // Capacitor (Android/iOS )
    "ionic://localhost",       // Ionic nativo
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware para parsear JSON con límite de tamaño
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Importar rutas
const usuariosRoutes = require("./routes/usuarios");
const reservasRoutes = require("./routes/reservas");
const motosRoutes = require("./routes/motos");
const parqueaderosRoutes = require("./routes/parqueaderos");

// Usar rutas
app.use("/usuarios", usuariosRoutes);
app.use("/reservas", reservasRoutes);
app.use("/motos", motosRoutes);
app.use("/parqueaderos", parqueaderosRoutes);

// Ruta de prueba / health check
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor funcionando 🚀", timestamp: new Date().toISOString() });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Levantar servidor después de conectar la base de datos
const PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });
