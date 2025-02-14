require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la conexión a MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Erick1234',
  database: 'login',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection()
  .then(connection => {
    console.log('✅ Conectado a MySQL');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión a MySQL:', err);
  });

// Servir archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/html', express.static(path.join(__dirname, 'html')));

app.get('/', (req, res) => {
  res.send('¡Hola desde Express con MySQL!');
});

// Obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error al obtener usuarios');
  }
});

// Agregar un usuario
app.post('/users', async (req, res) => {
  const { nombre, correo, domicilio, telefono } = req.body;
  try {
    const [result] = await db.query('INSERT INTO user (nombre, correo, domicilio, telefono) VALUES (?, ?, ?, ?)', [nombre, correo, domicilio, telefono]);
    res.status(201).json({ id: result.insertId, nombre, correo, domicilio, telefono });
  } catch (err) {
    res.status(400).send('Error al crear el usuario');
  }
});

// Actualizar un usuario
app.put('/users/:id', async (req, res) => {
  const { nombre, correo, domicilio, telefono } = req.body;
  try {
    await db.query('UPDATE user SET nombre = ?, correo = ?, domicilio = ?, telefono = ? WHERE id = ?', [nombre, correo, domicilio, telefono, req.params.id]);
    res.send('Usuario actualizado');
  } catch (err) {
    res.status(400).send('Error al actualizar el usuario');
  }
});

// Eliminar un usuario
app.delete('/users/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM user WHERE id = ?', [req.params.id]);
    res.send('Usuario eliminado');
  } catch (err) {
    res.status(400).send('Error al eliminar el usuario');
  }
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});