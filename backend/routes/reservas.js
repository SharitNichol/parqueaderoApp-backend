const express = require("express");
const router = express.Router();
const { getDb, ObjectId } = require("../db");

const toObjectId = (value) => {
  if (!value) return null;
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
};

const formatDoc = (doc) => {
  if (!doc) return null;
  return {
    ...doc,
    id: doc._id.toString(),
    usuario_id: doc.usuario_id ? doc.usuario_id.toString() : null,
    parqueadero_id: doc.parqueadero_id ? doc.parqueadero_id.toString() : null,
    moto_id: doc.moto_id ? doc.moto_id.toString() : null,
    _id: undefined,
  };
};

// POST /reservas — Crear una nueva reserva
router.post("/", async (req, res) => {
  const { usuario_id, parqueadero_id, moto_id, fecha_entrada, hora_inicio_clase, hora_fin_clase, estado } = req.body;

  if (!usuario_id || !parqueadero_id || !moto_id || !fecha_entrada) {
    return res.status(400).json({ error: "Faltan datos obligatorios para crear la reserva" });
  }

  // Validar que la fecha sea una fecha válida
  const fechaEntrada = new Date(fecha_entrada);
  if (isNaN(fechaEntrada.getTime())) {
    return res.status(400).json({ error: "La fecha de entrada no es válida" });
  }

  try {
    const db = getDb();
    const parqueaderoObjectId = toObjectId(parqueadero_id);
    const usuarioObjectId = toObjectId(usuario_id);
    const motoObjectId = toObjectId(moto_id);

    if (!parqueaderoObjectId || !usuarioObjectId || !motoObjectId) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    // Verificar que el parqueadero existe y tiene cupos
    const parqueadero = await db.collection("parqueaderos").findOne({ _id: parqueaderoObjectId });
    if (!parqueadero) {
      return res.status(404).json({ error: "Parqueadero no encontrado" });
    }

    if (parqueadero.disponibles <= 0) {
      return res.status(400).json({ error: "No hay cupos disponibles" });
    }

    // Verificar que la moto pertenece al usuario
    const moto = await db.collection("motos").findOne({ _id: motoObjectId, usuario_id: usuarioObjectId });
    if (!moto) {
      return res.status(403).json({ error: "La moto no pertenece al usuario o no existe" });
    }

    // Verificar que no exista ya una reserva activa para el mismo usuario en la misma fecha
    const fechaInicio = new Date(fechaEntrada);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaEntrada);
    fechaFin.setHours(23, 59, 59, 999);

    const reservaExistente = await db.collection("reservas").findOne({
      usuario_id: usuarioObjectId,
      fecha_entrada: { $gte: fechaInicio, $lte: fechaFin },
      estado: "activa",
    });

    if (reservaExistente) {
      return res.status(409).json({ error: "Ya tienes una reserva activa para esa fecha" });
    }

    const result = await db.collection("reservas").insertOne({
      usuario_id: usuarioObjectId,
      parqueadero_id: parqueaderoObjectId,
      moto_id: motoObjectId,
      fecha_entrada: fechaEntrada,
      hora_inicio_clase: hora_inicio_clase || "07:00",
      hora_fin_clase: hora_fin_clase || "09:00",
      fecha_salida: null,
      estado: estado || "activa",
      valor_total: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection("parqueaderos").updateOne(
      { _id: parqueaderoObjectId },
      { $inc: { disponibles: -1 }, $set: { updatedAt: new Date() } }
    );

    const reserva = await db.collection("reservas").findOne({ _id: result.insertedId });
    res.status(201).json(formatDoc(reserva));
  } catch (err) {
    console.error("Error creando reserva:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// GET /reservas — Obtener reservas (filtrar por usuario_id si se provee)
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const filtro = {};

    if (req.query.usuario_id) {
      const usuarioObjectId = toObjectId(req.query.usuario_id);
      if (!usuarioObjectId) {
        return res.status(400).json({ error: "usuario_id inválido" });
      }
      filtro.usuario_id = usuarioObjectId;
    }

    const reservas = await db.collection("reservas").find(filtro).sort({ createdAt: -1 }).toArray();
    res.json(reservas.map(formatDoc));
  } catch (err) {
    console.error("Error obteniendo reservas:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// PATCH /reservas/:id/cancelar — Cancelar una reserva
router.patch("/:id/cancelar", async (req, res) => {
  try {
    const db = getDb();
    const reservaObjectId = toObjectId(req.params.id);

    if (!reservaObjectId) {
      return res.status(400).json({ error: "ID de reserva inválido" });
    }

    const reserva = await db.collection("reservas").findOne({ _id: reservaObjectId });
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (reserva.estado === "cancelada") {
      return res.json({ mensaje: "La reserva ya está cancelada" });
    }

    // No permitir cancelar reservas ya completadas
    if (reserva.estado === "completada") {
      return res.status(400).json({ error: "No se puede cancelar una reserva ya completada" });
    }

    await db.collection("reservas").updateOne(
      { _id: reservaObjectId },
      { $set: { estado: "cancelada", updatedAt: new Date() } }
    );

    // Devolver el cupo al parqueadero solo si la reserva estaba activa
    await db.collection("parqueaderos").updateOne(
      { _id: reserva.parqueadero_id },
      { $inc: { disponibles: 1 }, $set: { updatedAt: new Date() } }
    );

    res.json({ mensaje: "Reserva cancelada correctamente" });
  } catch (err) {
    console.error("Error cancelando reserva:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
