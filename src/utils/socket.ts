import { io } from '../app';
import socketio from 'socket.io';

import { userTable } from '../db/user-table';
import { SocketType } from './definitions';
import { logger } from './logger';
import { Message } from './message';
import { isMessageRequest, isValidString } from './validator';

const { INACTIVITY_TIMEOUT } = process.env;

const timer =
  typeof INACTIVITY_TIMEOUT === 'string' && Number(INACTIVITY_TIMEOUT)
    ? parseInt(INACTIVITY_TIMEOUT)
    : 1000 * 15 * 60; // 15 minutes

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
    clearTimeout(inactivityTimer);
    inactivityTimer = initTimeout();
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

  // remove disconnected user, update list of active users and send message (in case user was not previously removed)
  socket.on(SocketType.Disconnect, () => {
    logger.info(`user disconnected, socket id: ${socket.id}`);
    const removedUser = userTable.remove(socket.id);
    socket.broadcast.emit(SocketType.ActiveUsers, userTable.activeUsers);
    if (removedUser) {
      socket.broadcast.emit(
        SocketType.NewMessage,
        new Message().userDisconnected(removedUser.name)
      );
    }
  });

  // remove inactive user, update list of active users and send message (in case user was not previously removed)
  socket.on(SocketType.UserInactive, () => {
    logger.info(`user disconnected due to inactivity, socket id: ${socket.id}`);
    const removedUser = userTable.remove(socket.id);
    socket.broadcast.emit(SocketType.ActiveUsers, userTable.activeUsers);
    if (removedUser) {
      socket.broadcast.emit(
        SocketType.NewMessage,
        new Message().userInactive(removedUser.name)
      );
    }
  });

  // inactivity timer
  const initTimeout = () => {
    return setTimeout(() => {
      socket.emit(SocketType.UserInactive);
    }, timer);
  };

  let inactivityTimer = initTimeout();
});
