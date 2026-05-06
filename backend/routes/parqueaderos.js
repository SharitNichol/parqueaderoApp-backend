const express = require('express');
const router = express.Router();
// CORRECCIÓN: La ruta correcta para subir un nivel desde 'routes' es '../db'
const { getDb } = require('../db');

const formatDoc = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    nombre: doc.nombre,
    ubicacion: doc.ubicacion,
    capacidad: doc.capacidad,
    disponibles: doc.disponibles,
    tarifa_hora: doc.tarifa_hora, // Esto será 0 para la Sede Av 39
    estado: doc.estado,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    // Buscamos solo los parqueaderos activos
    const parqueaderos = await db.collection('parqueaderos').find({ estado: 'activo' }).toArray();
    
    // Enviamos la lista formateada para el frontend
    res.json(parqueaderos.map(formatDoc));
  } catch (err) {
    console.error('Error obteniendo parqueaderos:', err);
    res.status(500).json({ error: 'Error interno del servidor al consultar cupos' });
  }
});

module.exports = router;
