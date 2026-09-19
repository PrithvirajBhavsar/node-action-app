const express = require('express');
const apiRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

module.exports = app;
