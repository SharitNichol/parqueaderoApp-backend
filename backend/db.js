
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "parqueadero_ucc";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(dbName);
      console.log("MongoDB Atlas conectado a:", dbName);

      // Crear parqueadero inicial si no existe
      const parqueaderos = db.collection("parqueaderos");
      const existingParqueadero = await parqueaderos.findOne({ nombre: "Parqueadero UCC" });

      if (!existingParqueadero) {
        await parqueaderos.insertOne({
          nombre: "Parqueadero UCC",
          ubicacion: "Avenida 39",
          capacidad: 50,
          disponibles: 50,
          tarifa_hora: 5000.0,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log("Parqueadero inicial creado");
      }

    } catch (error) {
      console.error("Error conectando a MongoDB Atlas:", error);
      // No llamar process.exit aquí para que el llamador pueda manejarlo
      throw error;
    }
  }
  return db;
}

function getDb() {
  if (!db) {
    throw new Error("MongoDB no está conectado todavía. Llama a connectToDatabase() primero.");
  }
  return db;
}

// Cerrar la conexión limpiamente al terminar el proceso
process.on("SIGINT", async () => {
  await client.close();
  console.log("Conexión MongoDB cerrada");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await client.close();
  console.log("Conexión MongoDB cerrada");
  process.exit(0);
});

module.exports = { connectToDatabase, getDb, ObjectId };
