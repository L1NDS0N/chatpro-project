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
  console.log('Usuário conectados: ', io.allSockets());

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });

  socket.on('registrationEvent', async data => {
    const userData: User = { name: data, socket_id: socket.id };
    await userController.create(userData).then(savedUser => {
      socket.emit('registrationEvent', JSON.stringify(savedUser));
      console.log(savedUser);
    });
  });

  socket.on('sendMePreviousMessages', () => {
    messageController.list().then(previousMessages => {
      socket.emit('previousMessages', previousMessages);
      console.warn(
        'quantidade de mensagens enviadas: ',
        previousMessages.length,
      );
    });
  });

  socket.on('sendMessage', (data: any) => {
    const messageData: Message = {
      user_id: data.userId,
      message: data.message,
    };
    messageController.create(messageData).then(savedMessage => {
      socket.broadcast.emit('receivedMessage', savedMessage);
      console.log('mensagem salva e enviada para o frontend', savedMessage);
    });
  });
});

export { server as app };
