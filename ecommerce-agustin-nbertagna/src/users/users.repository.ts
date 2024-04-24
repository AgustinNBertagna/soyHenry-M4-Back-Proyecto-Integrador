import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  private users = [
    {
      id: 1,
      name: 'Alice',
      email: 'user1@example.com',
      password: 'secure123',
      address: '123 Main St',
      phone: '555-123-4567',
      country: 'United States',
      city: 'New York',
    },
    {
      id: 2,
      name: 'Bob',
      email: 'user2@example.com',
      password: 'strongPassword',
      address: '456 Elm Ave',
      phone: '555-987-6543',
      country: 'Canada',
      city: 'Toronto',
    },
    {
      id: 3,
      name: 'Charlie',
      email: 'user3@example.com',
      password: 's3cr3t',
      address: '789 Oak Rd',
      phone: '555-555-5555',
      country: 'United Kingdom',
      city: 'London',
    },
    {
      id: 4,
      name: 'David',
      email: 'user4@example.com',
      password: 'p@ssw0rd',
      address: '101 Pine Ln',
      phone: '555-123-7890',
      country: 'Australia',
      city: 'Sydney',
    },
    {
      id: 5,
      name: 'Eve',
      email: 'user5@example.com',
      password: 'topSecret',
      address: '222 Maple Ave',
      phone: '555-555-1234',
    },
  ];

  async getUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    const start: number = (page - 1) * limit;
    const end: number = start + limit;
    const users: User[] = await this.usersRepository
      .find()
      .then((users) => users.slice(start, end));
    return users.map((user) => {
      const { password, ...restUser } = user;
      return restUser;
    });
  }

  async getUserById(id: string): Promise<Omit<User, 'password' | 'isAdmin'>> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id },
      relations: { orders: true },
    });
    if (!user) throw new NotFoundException(`User not found.`);
    const { password, isAdmin, ...restUser } = user;
    return restUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async createUser(user: CreateUserDto): Promise<string> {
    const newUser: User = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser.id;
  }

  async updateUser(
    id: string,
    user: Partial<CreateUserDto>,
  ): Promise<{ id: string }> {
    const foundUser: User | null = await this.usersRepository.findOneBy({ id });
    if (!foundUser) throw new NotFoundException(`User not found.`);
    await this.usersRepository.update(id, user);
    return { id: foundUser.id };
  }

  async deleteUser(id: string): Promise<{ id: string }> {
    const user: User | null = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User not found.`);
    await this.usersRepository.delete(id);
    return { id: user.id };
  }
}
