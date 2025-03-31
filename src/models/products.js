const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  stockQuantity: { type: Number, required: true },
  isInternational: { type: Boolean, required: true },
  estimatedDeliveryTime: { type: String, required: true },
  seller: { type: String, required: true },
  image: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;