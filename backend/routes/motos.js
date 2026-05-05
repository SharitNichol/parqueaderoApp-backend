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
    _id: undefined,
  };
};

// GET /motos — Obtener motos (filtrar por usuario_id si se provee)
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const filter = {};

    if (req.query.usuario_id) {
      const usuarioObjectId = toObjectId(req.query.usuario_id);
      if (!usuarioObjectId) {
        return res.status(400).json({ error: "usuario_id inválido" });
      }
      filter.usuario_id = usuarioObjectId;
    }

    const motos = await db.collection("motos").find(filter).toArray();
    res.json(motos.map(formatDoc));
  } catch (err) {
    console.error("Error obteniendo motos:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// POST /motos — Registrar una nueva moto
router.post("/", async (req, res) => {
  const { usuario_id, placa, marca, modelo, color, anio } = req.body;

  if (!usuario_id || !placa || !marca || !modelo || !color || !anio) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Validar que el año sea un número entero razonable
  const anioNum = parseInt(anio, 10);
  const anioActual = new Date().getFullYear();
  if (isNaN(anioNum) || anioNum < 1900 || anioNum > anioActual + 1) {
    return res.status(400).json({ error: `El año debe estar entre 1900 y ${anioActual + 1}` });
  }

  try {
    const db = getDb();
    const usuarioObjectId = toObjectId(usuario_id);
    if (!usuarioObjectId) {
      return res.status(400).json({ error: "usuario_id inválido" });
    }

    // Verificar que la placa no esté ya registrada
    const placaNormalizada = placa.trim().toUpperCase();
    const motoExistente = await db.collection("motos").findOne({ placa: placaNormalizada });
    if (motoExistente) {
      return res.status(409).json({ error: "Ya existe una moto registrada con esa placa" });
    }

    const result = await db.collection("motos").insertOne({
      usuario_id: usuarioObjectId,
      placa: placaNormalizada,
      marca: marca.trim(),
      modelo: modelo.trim(),
      color: color.trim(),
      anio: anioNum,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const moto = await db.collection("motos").findOne({ _id: result.insertedId });
    res.status(201).json(formatDoc(moto));
  } catch (err) {
    console.error("Error registrando moto:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
