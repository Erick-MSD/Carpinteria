require('dotenv').config(); // Cargar las variables de entorno del archivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Asegúrate de importar path
const errorHandler = require('./middlewares/errorHandler'); 

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos (HTML, CSS y JS)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/html', express.static(path.join(__dirname, 'html')));

// Conectar a MongoDB Atlas usando la URI de .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('📌 Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB Atlas:', err));

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola desde Express!');
});

// Ruta para ejemplo de error
app.get('/error', (req, res) => {
  throw new Error('¡Ocurrió un error en esta ruta!');
});

// Usar el middleware de manejo de errores al final
app.use(errorHandler);

// Definir el modelo de Producto
const Product = require('./models/Product');

// Ruta para obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send('Error al obtener productos');
  }
});

// Ruta para recibir el formulario de interés
app.post('/interes', async (req, res) => {
  const { productoId, nombre, email } = req.body;
  
  // Aquí puedes guardar los datos del formulario en la base de datos o realizar alguna otra acción
  console.log(`Interés recibido: Producto ID: ${productoId}, Nombre: ${nombre}, Email: ${email}`);
  
  res.json({ message: 'Interés registrado con éxito' });
});

// Ruta para crear un nuevo producto
app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).send('Error al crear el producto');
  }
});

// Ruta para actualizar un producto
app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).send('Error al actualizar el producto');
  }
});

// Ruta para eliminar un producto
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send('Producto eliminado');
  } catch (err) {
    res.status(400).send('Error al eliminar el producto');
  }
});

// Ruta para recibir el formulario de contacto
const ContactForm = require('./models/ContactForm');

app.post('/contact', async (req, res) => {
  try {
    const newContact = new ContactForm(req.body);
    await newContact.save();
    res.status(201).send('Formulario enviado correctamente');
  } catch (err) {
    res.status(400).send('Error al enviar el formulario');
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
