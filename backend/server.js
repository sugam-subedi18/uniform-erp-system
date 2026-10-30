require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // your Vite frontend
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // design photos later

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/fabrics', require('./routes/fabricRoutes'));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
    await sequelize.sync(); // creates any missing tables from the models
    console.log('Tables ready');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Could not start the server:', err);
    process.exit(1);
  }
}

start();
