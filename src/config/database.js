const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI; // Confifure your MongoDB URI in the .env file

async function connectDatabase() {
  try {
    await mongoose.connect(uri);

    console.log('✅ Conectado ao MongoDB!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
