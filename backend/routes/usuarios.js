const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

const formatUsuario = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    nombre: doc.nombre,
    correo: doc.correo,
  };
};

router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  // Modo de prueba para la UCC
  if (correo === "admin@ucc.edu.co" && password === "123456") {
    return res.status(200).json({
      mensaje: 'Login de prueba exitoso',
      token: 'token_secreto_123',
      usuario: { id: "test_001", nombre: "Admin UCC", correo: "admin@ucc.edu.co" }
    });
  }

  try {
    const db = getDb();
    const usuario = await db.collection('usuarios').findOne({ correo, password });
    if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' });
    return res.status(200).json({
      mensaje: 'Login exitoso',
      token: 'token_ejemplo_123',
      usuario: formatUsuario(usuario),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error de base de datos' });
  }
});

router.post('/registro', async (req, res) => {
  const { nombre, correo, password } = req.body;
  try {
    const db = getDb();
    const result = await db.collection('usuarios').insertOne({
      nombre, correo, password, createdAt: new Date()
    });
    return res.status(201).json({
      mensaje: 'Usuario registrado',
      usuario: { id: result.insertedId.toString(), nombre, correo },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error en registro' });
  }
});

module.exports = router;
