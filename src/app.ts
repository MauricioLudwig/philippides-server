/**
 * * Modules
 */
import http from 'http';
import express from 'express';
import socketio from 'socket.io';

require('./db/user-table'); // initialize mock user table
import { logger } from './utils/logger';

/**
 * * Configuration
 */
const app = express();
const server = http.createServer(app);
export const io = socketio(server);
const port = process.env.PORT || 4000;

/**
 * * Socket
 */
import { config } from './utils/socket';
io.on('connection', config);

/**
 * * Server
 */
server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

/**
 * * Graceful shutdown
 */
const gracefulShutdown = (): void => {
  logger.info('Initializing graceful shutdown');

  io.close();

  server.close(() => {
    logger.info('Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => {
    logger.info('Server was forcefully shutdown');
    process.exit(1);
  }, 15000); // = 15 seconds
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
