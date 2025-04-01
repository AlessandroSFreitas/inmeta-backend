const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  'https://nuxt-app-phi-sand.vercel.app',
  'http://localhost:3001',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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