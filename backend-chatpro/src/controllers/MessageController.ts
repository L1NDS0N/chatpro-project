import { FindOperator, getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { Message } from '../models/Message';
import { MessageRepository } from '../repositories/MessageRepository';

class MessageController {
  async create(data: Message) {
    const { id, user_id, message } = data;
    const messagesRepository = getCustomRepository(MessageRepository);

    const messageAlreadyExists = await messagesRepository.findOne({ id });

    if (messageAlreadyExists) {
      throw new AppError('Message already exists!');
    }

    const messageCreated = messagesRepository.create({
      user_id,
      message,
    });
    console.log(`New message created in database${{}}`);
    const savedMessage = await messagesRepository.save(messageCreated);

    return savedMessage;
  }

  async list() {
    const messagesRepository = getCustomRepository(MessageRepository);

    const messages = await messagesRepository.find();
    return messages;
  }
}

export { MessageController };
