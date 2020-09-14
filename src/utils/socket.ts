import socketio from 'socket.io';

import { IMessageRequest, SocketType } from './definitions';
import { Message } from './message';
import { isMessageRequest } from './validator';
import { io } from '../app';

export const config = (socket: socketio.Socket): void => {
  io.on('connection', () => {
    console.log('new connection');
  });

  socket.on(SocketType.NewMessage, (req: unknown) => {
    if (!isMessageRequest(req)) {
      // TODO send back validation error
    }

    const { id, message } = req as IMessageRequest;
    const newMessage = new Message().new(id, message);
    socket.broadcast.emit(SocketType.NewMessage, newMessage);
  });

  socket.on(SocketType.UserDisconnected, () => {});

  socket.on(SocketType.UserInactive, () => {});
};
