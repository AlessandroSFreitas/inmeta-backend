const express = require('express');
const cors = require('cors');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

// Routes
const statusRoutes = require('./routes/status');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/product');

app.use('/api/status', statusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', productsRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Microserviço ativo 🚀');
});

module.exports = app;

// List all routes on the console
function listRoutes(app) {
  console.log('\n📡 ROTAS REGISTRADAS:\n');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Rota direta
      console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} - ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Rota em um Router()
      middleware.handle.stack.forEach((handler) => {
        const path = handler.route?.path;
        const method = handler.route && Object.keys(handler.route.methods).join(', ').toUpperCase();
        if (path && method) {
          console.log(`${method} - ${path}`);
        }
      });
    }
  });
}

listRoutes(app);