import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { User } from '../entities/User.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() user: CreateUserDto): Promise<Partial<User>> {
    return await this.authService.signUp(user);
  }

  @Post('signin')
  async signIn(
    @Body() credentials: LoginUserDto,
  ): Promise<{ message: string; token: string }> {
    return await this.authService.signIn(credentials);
  }
}
