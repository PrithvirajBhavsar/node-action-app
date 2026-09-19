require('dotenv').config();

const app = require('./src/app');

const DEFAULT_PORT = 3000;
const portFromEnv = Number(process.env.PORT || DEFAULT_PORT);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on port ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
};

startServer(portFromEnv);