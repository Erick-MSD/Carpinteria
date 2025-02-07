const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },  // URL de la imagen del producto
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;