import socketio from 'socket.io';

import { IMessageRequest, SocketType } from './definitions';
import { Message } from './message';
import { isMessageRequest } from './validator';

export default (socket: socketio.Socket): void => {
  socket.on(SocketType.NewMessage, (req: unknown) => {
    if (!isMessageRequest(req)) {
      // TODO send back validation error
    }

    const { id, message } = req as IMessageRequest;
    const newMessage = new Message().new(id, message);
    socket.broadcast.emit(SocketType.NewMessage, newMessage);
  });
};
