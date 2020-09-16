import socketio from 'socket.io';

import { IMessageRequest, SocketType } from './definitions';
import { logger } from './logger';
import { Message } from './message';
import { isMessageRequest } from './validator';
import { io } from '../app';

export const config = (socket: socketio.Socket): void => {
  io.on('connection', () => {
    logger.info(`New connection established, socket id: ${socket.id}`);
    io.emit(SocketType.NewMessage, new Message().userConnected());
  });

  socket.on(SocketType.NewMessage, (req: unknown) => {
    if (!isMessageRequest(req)) {
      logger.error('Invalid data provided');
    }

    logger.info('New message received');
    const { id, text } = req as IMessageRequest;
    const newMessage = new Message().new(id, text);
    io.sockets.emit(SocketType.NewMessage, newMessage);
    logger.info('New message sent');
  });

  socket.on(SocketType.UserDisconnected, () => {
    logger.info('User disconnected');
  });

  socket.on(SocketType.UserInactive, () => {
    logger.info('User inactive');
  });
};
