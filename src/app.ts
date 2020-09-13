// modules
import http from 'http';
import express from 'express';
import socketio from 'socket.io';

require('./db/user-table'); // initialize mock user table

// configuration
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

// socket
import socket from './utils/socket';
io.on('connection', socket);

// server
server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
