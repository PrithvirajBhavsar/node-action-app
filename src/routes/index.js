const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./users.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'ok' : 'error',
    mongo: isConnected ? 'connected' : 'disconnected',
  });
});

router.use('/users', usersRouter);

module.exports = router;
