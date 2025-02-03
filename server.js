require('dotenv').config(); // Cargar las variables de entorno del archivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB Atlas usando la URI de .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('📌 Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB Atlas:', err));

app.get('/', (req, res) => {
  res.send('¡Hola desde Express con MongoDB Atlas!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
