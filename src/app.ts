import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';

import { userTable } from './db/user-table'; // initializes the mock user table
import usersRouter from './routers/users';
import { IMessageRequest, SocketType } from './utils/definitions';
import { logger } from './utils/logger';
import { Message } from './utils/message';

const app = express();
app.use(cors());
app.use(express.json());
app.use(usersRouter);

const server = http.createServer(app);
export const io = socketio(server);
const port = process.env.PORT || 4000;

io.on('connection', (socket: socketio.Socket): void => {
  const { userId }: { userId: string } = socket.handshake.query;

  if (!userTable.exists(userId)) {
    socket.disconnect();
    return;
  }

  // emit message to all clients (about newly connected client)
  const user = userTable.addSocketId(userId, socket.id);
  io.emit(SocketType.NewMessage, new Message().userConnected(user.name));

  // emit list of active users, inclusive current client
  io.emit(SocketType.ActiveUsers, userTable.activeUsers);

  socket.on(SocketType.NewMessage, (req: unknown) => {
    logger.info('New message received');
    const { id, text } = req as IMessageRequest;
    const newMessage = new Message().new(id, text);
    io.sockets.emit(SocketType.NewMessage, newMessage);
    logger.info('New message sent');
  });

  socket.on(SocketType.UserDisconnected, () => {
    userTable.remove(socket.id);
    logger.info('User disconnected');
  });

  socket.on(SocketType.UserInactive, () => {
    userTable.remove(socket.id);
    logger.info('User inactive');
  });

  socket.on('disconnect', () => {
    logger.info('disconnect!');
    const username = userTable.remove(socket.id);
    io.sockets.emit(SocketType.ActiveUsers, userTable.activeUsers);
    io.sockets.emit(
      SocketType.NewMessage,
      new Message().userDisconnected(username)
    );
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

const gracefulShutdown = (): void => {
  logger.info('Initializing graceful shutdown');

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
