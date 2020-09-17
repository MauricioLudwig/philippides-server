import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';

require('./db/user-table'); // initializes the mock user table
import usersRouter from './routers/users';

const app = express();
app.use(cors());
app.use(express.json());
app.use(usersRouter);

const server = http.createServer(app);
export const io = socketio(server);
const port = process.env.PORT || 4000;

require('./utils/socket'); // import file to begin listening to messages

server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
