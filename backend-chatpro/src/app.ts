import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import 'reflect-metadata';
import createConnection from './database';
import { AppError } from './errors/AppError';
import { User } from './models/User';

import { UserController } from './controllers/UserController';
import { MessageController } from './controllers/MessageController';
import { Message } from './models/Message';
const userController = new UserController();
const messageController = new MessageController();

createConnection();

const app = express();

app.use(express.json());
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'Error',
    message: `Internal server error ${err.message}`,
  });
});

io.on('connection', (socket: any) => {
  console.log(`New user connected: ${socket.id}`);
  console.log(io.allSockets());

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });

  socket.on('registrationEvent', async data => {
    const userData: User = { name: data, socket_id: socket.id };
    await userController.create(userData).then(savedUser => {
      socket.emit('registrationEvent', JSON.stringify(savedUser));
      console.log(`usuário salvo e enviado para o frontend`);
      console.log(savedUser);
    });
  });

  let messages: User;
  socket.on('sendMessage', async data => {
    console.log('mensagem salva e enviada para o frontend');
    const messageData: Message = {
      user_id: data.user_id,
      message: data.message,
    };
    socket.broadcast.emit('receivedMessage', messages);
    await messageController.create(messageData).then(savedMessage => {
      console.log(savedMessage);
    });
  });
});

export { server as app };
