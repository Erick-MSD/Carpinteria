require('dotenv').config();
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://www.kcmcocinas.com', // Cambia esto a tu dominio
}));  
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana
});
app.use(limiter);

// Configuración de la conexión a MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
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

// Servir el archivo login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/', (req, res) => {
  res.send('¡Hola desde Express con MySQL!');
});

// Esquema de validación de usuario
const userSchema = Joi.object({
  nombre: Joi.string().required(),
  correo: Joi.string().email().required(),
  domicilio: Joi.string().optional(),
  telefono: Joi.string().optional(),
  password: Joi.string().min(8).required(),
  role: Joi.string().optional()
});

// Registro de usuario (Hash de contraseña)
app.post('/register', async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { nombre, correo, domicilio, telefono, password, role } = value;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO user (nombre, correo, domicilio, telefono, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, correo, domicilio, telefono, hashedPassword, role || 'user']
    );

    res.status(201).json({ id: result.insertId, nombre, correo, role });
  } catch (err) {
    res.status(400).json({ message: 'Error al registrar usuario', error: err.message });
  }
});

// Login de usuario
app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
  }

  try {
    const [users] = await db.query('SELECT id, nombre, correo, password, role FROM user WHERE correo = ?', [correo]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login exitoso', token, user: { id: user.id, nombre: user.nombre, correo: user.correo, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el login', error: err.message });
  }
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token no válido' });

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en la autenticación', error: err.message });
  }
}

// Ruta protegida de ejemplo
app.get('/perfil', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, nombre, correo, role FROM user WHERE id = ?', [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message });
  }
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});