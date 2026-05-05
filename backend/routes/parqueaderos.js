const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

const formatDoc = (doc) => {
  if (!doc) return null;
  return {
    ...doc,
    id: doc._id.toString(),
    _id: undefined,
  };
};

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const parqueaderos = await db.collection('parqueaderos').find({ estado: 'activo' }).toArray();
    res.json(parqueaderos.map(formatDoc));
  } catch (err) {
    console.error('Error obteniendo parqueaderos:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
