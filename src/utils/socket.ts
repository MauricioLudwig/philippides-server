import { io } from '../app';
import socketio from 'socket.io';

import { userTable } from '../db/user-table';
import { SocketType, IUser } from './definitions';
import { logger } from './logger';
import { Message } from './message';
import { isMessageRequest, isValidString } from './validator';

io.on(SocketType.Connection, (socket: socketio.Socket): void => {
  logger.info(`new connection established, socket id: ${socket.id}`);
  const { userId }: { userId: unknown } = socket.handshake.query;

  if (!isValidString(userId)) {
    logger.info(
      `socket connection terminated, invalid user id, ${userId}, provided`
    );
    socket.disconnect();
    return;
  }

  if (!userTable.exists(userId)) {
    logger.info(
      `socket connection terminated, user by id: ${userId} not found`
    );
    socket.disconnect();
    return;
  }

  // emit message to all clients (about newly connected client)
  const user = userTable.addSocketId(userId, socket.id);
  logger.info(`new message sent (new user ${user.name} connected)`);
  io.emit(SocketType.NewMessage, new Message().userConnected(user.name));

  // emit list of active users, inclusive current client
  const activeUsers = userTable.activeUsers;
  logger.info(`list of active users sent, total = ${activeUsers.length}`);
  io.emit(SocketType.ActiveUsers, activeUsers);

  // receive and send user messages
  socket.on(SocketType.NewMessage, (req: unknown) => {
    logger.info('new message received (user message)');

    if (!isMessageRequest(req)) {
      logger.info('message rejected, wrong payload');
      socket.emit(SocketType.Alert, 'unable to process message');
      return;
    }

    const { id, text } = req;
    io.emit(SocketType.NewMessage, new Message().new(id, text));
    logger.info('new message sent (user message)');
  });

  // send message about disconnected user and update list of active users
  socket.on(SocketType.UserDisconnected, () => {
    logger.info('remove user due to disconnect');
    const { name } = removeUser(socket.id);
    socket.broadcast.emit(SocketType.ActiveUsers, userTable.activeUsers);
    socket.broadcast.emit(
      SocketType.NewMessage,
      new Message().userDisconnected(name)
    );
  });

  // send message about inactive user and update list of active users
  socket.on(SocketType.UserInactive, () => {
    logger.info('remove user due to inactivity');
    const { name } = removeUser(socket.id);
    socket.broadcast.emit(SocketType.ActiveUsers, userTable.activeUsers);
    socket.broadcast.emit(
      SocketType.NewMessage,
      new Message().userInactive(name)
    );
  });

  // send message about disconnected user and update list of active users
  socket.on(SocketType.Disconnect, () => {
    logger.info('socket disconnected');
    const { name } = removeUser(socket.id);
    socket.broadcast.emit(SocketType.ActiveUsers, userTable.activeUsers);
    socket.broadcast.emit(
      SocketType.NewMessage,
      new Message().userDisconnected(name)
    );
  });

  // helper function to remove user
  const removeUser = (socketId: string): IUser => {
    const user = userTable.remove(socketId);
    logger.info(`remove user ${user.name} by id: ${user.id}`);
    return user;
  };
});
