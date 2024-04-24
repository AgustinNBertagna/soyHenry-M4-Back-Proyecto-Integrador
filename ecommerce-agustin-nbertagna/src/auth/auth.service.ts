import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { User } from '../entities/User.entity';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: CreateUserDto): Promise<Partial<User>> {
    const dbUser: User | null = await this.usersRepository.getUserByEmail(
      user.email,
    );
    if (dbUser) throw new BadRequestException('Email already in use.');
    if (user.confirmPassword !== user.password)
      throw new BadRequestException(
        'Confirm password must be equal to passowrd.',
      );
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(user.password, 10);
    } catch (error) {
      throw new BadRequestException('Failed to hash credentials.');
    }
    const id = await this.usersRepository.createUser({
      ...user,
      password: hashedPassword,
    });
    const { password, confirmPassword, isAdmin, ...restUser } = user;
    return { id, ...restUser };
  }

  async signIn(
    credentials: LoginUserDto,
  ): Promise<{ message: string; token: string }> {
    const { email, password } = credentials;
    const user: User | null = await this.usersRepository.getUserByEmail(email);
    if (!user) throw new NotFoundException('User not found.');
    const validPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!validPassword) throw new BadRequestException('Invalid credentials.');
    const userPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      roles: user.isAdmin ? Role.Admin : Role.User,
    };
    const token: string = this.jwtService.sign(userPayload);
    return { message: 'User logged in successfully.', token };
  }
}
