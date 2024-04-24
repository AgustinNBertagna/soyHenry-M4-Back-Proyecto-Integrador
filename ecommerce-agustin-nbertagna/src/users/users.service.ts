import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { User } from 'src/entities/User.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    if (isNaN(page) && isNaN(limit))
      return await this.usersRepository.getUsers(1, 5);
    if (isNaN(page)) return await this.usersRepository.getUsers(1, limit);
    if (isNaN(limit)) return await this.usersRepository.getUsers(page, 5);
    return await this.usersRepository.getUsers(page, limit);
  }

  async getUserById(id: string): Promise<Omit<User, 'password' | 'isAdmin'>> {
    return await this.usersRepository.getUserById(id);
  }

  async createUser(user: CreateUserDto): Promise<string> {
    return await this.usersRepository.createUser(user);
  }

  async updateUser(
    id: string,
    user: Partial<CreateUserDto>,
  ): Promise<{ id: string }> {
    return await this.usersRepository.updateUser(id, user);
  }

  async deleteUser(id: string): Promise<{ id: string }> {
    return await this.usersRepository.deleteUser(id);
  }
}
