const express = require("express");
const router = express.Router();
const { getDb } = require("../db");
const crypto = require("crypto");

function generarToken(usuarioId) {
  const payload = `${usuarioId}-${Date.now()}-${Math.random()}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

const formatUsuario = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    nombre: doc.nombre,
    correo: doc.correo,
  };
};

router.post("/login", async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
  }

  // --- LOGIN DE EMERGENCIA PARA PRUEBAS ---
  if (correo === "admin@ucc.edu.co" && password === "123456") {
    return res.status(200).json({
      mensaje: "Login exitoso (Modo Prueba)",
      token: "token_emergencia_ucc",
      usuario: { id: "000000000000000000000000", nombre: "Administrador UCC", correo: "admin@ucc.edu.co" }
    });
  }

  try {
    const db = getDb();
    const usuario = await db.collection("usuarios").findOne({ correo, password });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    const token = generarToken(usuario._id.toString());
    return res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: formatUsuario(usuario),
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error de base de datos" });
  }
});

router.post("/registro", async (req, res) => {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
  }

  // CORRECCIÓN: Expresión regular estándar para correos
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ error: "Formato de correo inválido" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    const db = getDb();
    const existente = await db.collection("usuarios").findOne({ correo });
    if (existente) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    const result = await db.collection("usuarios").insertOne({
      nombre,
      correo,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({
      mensaje: "Usuario registrado",
      usuario: { id: result.insertedId.toString(), nombre, correo },
    });
  } catch (err) {
    console.error("Error en registro:", err);
    return res.status(500).json({ error: "Error en registro" });
  }
});

module.exports = router;
