const express = require('express');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');

const app = express();

connectDB();

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the New API' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;