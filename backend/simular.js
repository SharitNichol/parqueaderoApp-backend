require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

async function simularDatos() {
  // Usar la URI del .env en lugar de hardcodear localhost
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "parqueadero_ucc";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    // 1. Crear un usuario de prueba (verificar si ya existe)
    const correoTest = "prueba@ucc.edu.co";
    let usuario = await db.collection("usuarios").findOne({ correo: correoTest });

    if (!usuario) {
      const userId = new ObjectId();
      await db.collection("usuarios").insertOne({
        _id: userId,
        nombre: "Estudiante UCC",
        correo: correoTest,
        password: "prueba123",  // Contraseña con mínimo 6 caracteres
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      usuario = await db.collection("usuarios").findOne({ correo: correoTest });
      console.log("✅ Usuario de prueba creado");
    } else {
      console.log("ℹ️  El usuario de prueba ya existe, se omite creación");
    }

    const userId = usuario._id;

    // 2. Crear una moto para ese usuario (si no existe)
    const placaTest = "UCC-123";
    let moto = await db.collection("motos").findOne({ placa: placaTest });

    if (!moto) {
      const motoId = new ObjectId();
      await db.collection("motos").insertOne({
        _id: motoId,
        usuario_id: userId,
        placa: placaTest,
        marca: "Yamaha",
        modelo: "FZ25",
        color: "Azul",
        anio: 2024,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      moto = await db.collection("motos").findOne({ placa: placaTest });
      console.log("✅ Moto de prueba creada");
    } else {
      console.log("ℹ️  La moto de prueba ya existe, se omite creación");
    }

    const motoId = moto._id;

    // 3. Buscar un parqueadero para asociar la reserva
    const parqueadero = await db.collection("parqueaderos").findOne({});
    if (!parqueadero) {
      console.log("❌ No hay parqueaderos en la BD. El servidor los crea al iniciar.");
      return;
    }

    // 4. Crear reservas de prueba solo si no existen
    const reservasExistentes = await db.collection("reservas").countDocuments({ usuario_id: userId });
    if (reservasExistentes === 0) {
      await db.collection("reservas").insertMany([
        {
          usuario_id: userId,
          parqueadero_id: parqueadero._id,
          moto_id: motoId,
          fecha_entrada: new Date(),
          hora_inicio_clase: "08:00",
          hora_fin_clase: "10:00",
          estado: "activa",
          valor_total: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          usuario_id: userId,
          parqueadero_id: parqueadero._id,
          moto_id: motoId,
          fecha_entrada: new Date("2024-05-01T14:00:00Z"),
          hora_inicio_clase: "14:00",
          hora_fin_clase: "16:00",
          estado: "completada",
          valor_total: 10000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          usuario_id: userId,
          parqueadero_id: parqueadero._id,
          moto_id: motoId,
          fecha_entrada: new Date("2024-04-28T18:00:00Z"),
          hora_inicio_clase: "18:00",
          hora_fin_clase: "22:00",
          estado: "cancelada",
          valor_total: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]);
      console.log("✅ Reservas de prueba creadas");
    } else {
      console.log("ℹ️  Ya existen reservas para el usuario de prueba, se omite creación");
    }

    console.log("\n✅ Simulación completada.");
    console.log("👉 Entra a la App con: prueba@ucc.edu.co / prueba123");
    console.log("👉 Verás el QR activo y 3 reservas en el historial.");

  } catch (err) {
    console.error("❌ Error en simulación:", err);
  } finally {
    await client.close();
  }
}

simularDatos();
