require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

const corsOptions = {
  origin: ['http://localhost:5500', 'https://carpinteria-ten.vercel.app', 'https://propiacsa.com.mx/carpinteria/'],
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));



// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de solicitudes por IP
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
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Esquema de validación
const userSchema = Joi.object({
  nombre: Joi.string().required(),
  correo: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { nombre, correo, password } = value;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO user (nombre, correo, password) VALUES (?, ?, ?)',
      [nombre, correo, hashedPassword]
    );
    res.status(201).json({ id: result.insertId, nombre, correo });
  } catch (err) {
    res.status(400).json({ message: 'Error al registrar usuario', error: err.message });
  }
});

// Inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });

  try {
    const [users] = await db.query('SELECT id, nombre, correo, password FROM user WHERE correo = ?', [correo]);
    if (users.length === 0) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login exitoso', token, user: { id: user.id, nombre: user.nombre, correo: user.correo } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el login', error: err.message });
  }
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token no válido' });
    req.user = user;
    next();
  });
}

// Ruta protegida de perfil
app.get('/perfil', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, nombre, correo FROM user WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});