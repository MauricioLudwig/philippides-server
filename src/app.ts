import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';

require('./db/user-table'); // initializes the mock user table
import usersRouter from './routers/users';
import { logger } from './utils/logger';

const app = express();
app.use(cors());
app.use(express.json());
app.use(usersRouter);

const server = http.createServer(app);
export const io = socketio(server);
const port = process.env.PORT || 4000;

require('./utils/socket'); // import file to begin listening to messages

server.listen(port, () => {
  logger.info(`server is up on port ${port}`);
});

const gracefulShutdown = (): void => {
  logger.info('initializing graceful shutdown');

  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    logger.info('server was forcefully shutdown');
    process.exit(1);
  }, 15000); // = 15 seconds
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
