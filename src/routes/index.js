const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./auth.routes');
const usersRouter = require('./users.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isConnected = readyState === 1;
  const connectionError = mongoose.connection._lastError || null;
  const reason = isConnected
    ? 'Database connection is active.'
    : connectionError
      ? connectionError.message || 'Unknown MongoDB connection error.'
      : 'Database is not connected.';

  const mongoUri = process.env.MONGO_URI || null;
  const sanitizedMongoUri = mongoUri
    ? mongoUri.includes('@')
      ? mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
      : mongoUri
    : null;

  const connectionInfo = {
    status: isConnected ? 'ok' : 'error',
    mongo: stateMap[readyState] || 'unknown',
    reason,
    readyState,
    connectionString: sanitizedMongoUri,
    database: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
    port: mongoose.connection.port || null,
    error: connectionError ? {
      name: connectionError.name,
      message: connectionError.message,
      stack: connectionError.stack,
    } : null,
    app: {
      name: 'app',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  };

  res.status(isConnected ? 200 : 503).json(connectionInfo);
});

router.use('/auth', authRouter);
router.use('/users', usersRouter);

module.exports = router;