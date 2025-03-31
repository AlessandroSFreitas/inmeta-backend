const app = require('./app');
const connectDatabase = require('./config/database');

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Microserviço rodando em http://localhost:${PORT}`);
  });
});
