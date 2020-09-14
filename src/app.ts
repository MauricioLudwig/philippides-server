// modules
import http from 'http';
import express from 'express';
import socketio from 'socket.io';

require('./db/user-table'); // initialize mock user table

// configuration
const app = express();
const server = http.createServer(app);
export const io = socketio(server);
const port = process.env.PORT || 4000;

// socket
import { config } from './utils/socket';
io.on('connection', config);

// server
server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
