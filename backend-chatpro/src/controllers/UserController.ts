import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

class UserController {
  async create(data: User) {
    const { id, name, socket_id } = data;
    const usersRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await usersRepository.findOne({ id });

    if (userAlreadyExists) {
      throw new AppError('User already exists!');
    }

    const user = usersRepository.create({
      name,
      socket_id,
    });

    const savedUser = await usersRepository.save(user);

    return savedUser;
  }
}

export { UserController };
