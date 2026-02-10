const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');
const sql = require('mssql');
const xss = require('xss');

// Expresiones regulares
const regexName = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexCargo = /^[a-zA-ZÀ-ÿ\s]{2,75}$/;
const regexPhone = /^[0-9]{4}-[0-9]{4}$/;

router.post('/register', async (req, res) => {
  const nombre = xss(req.body.nombre);
  const apellido = xss(req.body.apellido);
  const email = xss(req.body.email);
  const cargo = xss(req.body.cargo);
  const telefono = xss(req.body.telefono);

  // Validaciones
  if (!regexName.test(nombre)) return res.status(400).send('Nombre inválido');
  if (!regexName.test(apellido)) return res.status(400).send('Apellido inválido');
  if (!regexEmail.test(email)) return res.status(400).send('Correo inválido');
  if (!regexCargo.test(cargo)) return res.status(400).send('Cargo inválido');
  if (!regexPhone.test(telefono)) return res.status(400).send('Teléfono inválido');

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('apellido', sql.VarChar, apellido)
      .input('email', sql.VarChar, email)
      .input('cargo', sql.VarChar, cargo)
      .input('telefono', sql.VarChar, telefono)
      .query('INSERT INTO usuario (nombre, apellido, email, cargo, telefono) VALUES (@nombre, @apellido, @email, @cargo, @telefono)');
    res.send('Usuario registrado con éxito');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el registro');
  }
});

router.get('/usuarios', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM usuario');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Error al obtener usuarios');
  }
});

module.exports = router;
