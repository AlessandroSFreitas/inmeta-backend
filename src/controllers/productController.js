const Product = require('../models/products');

async function createProduct(req, res) {
  const { name, price, description, isFavorite, stockQuantity, isInternational, estimatedDeliveryTime, seller, image } = req.body;

  try {
    const product = new Product({
      name,
      price,
      description,
      isFavorite,
      stockQuantity,
      isInternational,
      estimatedDeliveryTime,
      seller,
      image,
    });

    await product.save();
    res.status(201).json({ message: 'Product successfully created!', product });
  } catch (error) {
    res.status(400).send('Error creating product: ' + error.message);
  }
}

async function listProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send('Error fetching products: ' + error.message);
  }
}

async function getProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.status(200).json(product);
  }
  catch (error) {
    res.status(400).send('Error fetching product: ' + error.message);
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.status(200).json({ message: 'Product successfully updated!', product });
  } catch (error) {
    res.status(400).send('Error updating product: ' + error.message);
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.status(200).json({ message: 'Product successfully deleted!' });
  } catch (error) {
    res.status(500).send('Error deleting product: ' + error.message);
  }
}

module.exports = { createProduct, listProducts, updateProduct, deleteProduct, getProduct };