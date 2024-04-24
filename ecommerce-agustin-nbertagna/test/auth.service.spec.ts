import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { UsersRepository } from '../src/users/users.repository';
import { User } from '../src/entities/User.entity';
import * as jwt from 'jsonwebtoken';

describe('Auth Service Testing.', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersRepository>;
  let mockUserDto: CreateUserDto;
  const mockUser: User = {
    id: 'b29cc586-68f5-4c48-80b9-20a088b09a5d',
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '$2a$10$L2XZI7hDtVOgOet/llyYauFgLfK0d.u4qlXWaGauWrLTRoDCzkIuK',
    address: '123 Main Street',
    phone: 5551234,
    country: 'United States',
    city: 'New York',
    isAdmin: false,
    orders: [],
  };

  const mockJwtModule = {
    sign: (payload) => jwt.sign(payload, 'testSecret'),
  };

  beforeEach(async () => {
    mockUserDto = {
      name: 'John Doe',
      email: 'janedoe@example.com',
      password: '!1MySecret@',
      confirmPassword: '!1MySecret@',
      address: '123 Main Street',
      phone: 5551234,
      country: 'United States',
      city: 'New York',
    } as CreateUserDto;
    mockUsersService = {
      getUserByEmail: (email: string) => Promise.resolve(null),
      createUser: (user: CreateUserDto) =>
        Promise.resolve('b29cc586-68f5-4c48-80b9-20a088b09a5d'),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtModule },
        { provide: UsersRepository, useValue: mockUsersService },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  it('AuthService must be defined.', async () => {
    expect(authService).toBeDefined();
  });

  it('signUp() method should return the User without passwords and role.', async () => {
    const user = await authService.signUp(mockUserDto);
    expect(user).toBeDefined();
    expect(Object.keys(user)).toEqual([
      'id',
      'name',
      'email',
      'address',
      'phone',
      'country',
      'city',
    ]);
  });

  it('signUp() should throw an Error if the email is already in use.', async () => {
    mockUsersService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser);
    mockUserDto = { ...mockUserDto, email: 'johndoe@example.com' };
    try {
      await authService.signUp(mockUserDto);
    } catch (error) {
      expect(error.message).toBe('Email already in use.');
    }
  });

  it('signUp() should throw an Error if password and confirmPassword are not equal.', async () => {
    mockUserDto = { ...mockUserDto, confirmPassword: 'Not the same password' };
    try {
      await authService.signUp(mockUserDto);
    } catch (error) {
      expect(error.message).toBe('Confirm password must be equal to passowrd.');
    }
  });

  it('signUp() should throw an Error if password is not hasheable.', async () => {
    const notHasheable = [];
    mockUserDto = {
      ...mockUserDto,
      password: notHasheable,
      confirmPassword: notHasheable,
    } as any;
    try {
      await authService.signUp(mockUserDto);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Failed to hash credentials.');
    }
  });

  it('signIn() should return a message and a token, the token should be valid and the payload must be decoded succesfully.', async () => {
    mockUsersService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser);
    const email = mockUser.email;
    const password = mockUserDto.password;
    const result = await authService.signIn({ email, password });
    expect(result).toBeDefined();
    expect(Object.keys(result)).toEqual(['message', 'token']);
    expect(result.message).toBe('User logged in successfully.');
    const payload: any = jwt.verify(result.token, 'testSecret');
    expect(payload).toBeDefined();
    expect(Object.keys(payload)).toEqual([
      'sub',
      'id',
      'email',
      'roles',
      'iat',
    ]);
    expect(payload.sub).toBe(mockUser.id);
    expect(payload.id).toBe(mockUser.id);
    expect(payload.email).toBe(mockUser.email);
    expect(payload.roles).toBe('user');
  });

  it('signIn() should throw an Error if the user is not found.', async () => {
    const email = mockUser.email;
    const password = mockUserDto.password;
    try {
      await authService.signIn({ email, password });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('User not found.');
    }
  });

  it("signIn() should throw an Error if the password can't be decrypted.", async () => {
    mockUsersService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser);
    const email = mockUser.email;
    const password = 'BadPassword';
    try {
      await authService.signIn({ email, password });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Invalid credentials.');
    }
  });
});
