import {
  Controller,
  HttpCode,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  BadGatewayException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { User } from '../entities/User.entity';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<Omit<User, 'password'>[]> {
    if (page === 0) page = 1;
    if (limit === 0) limit = 5;
    return await this.usersService.getUsers(page as number, limit as number);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<User, 'password' | 'isAdmin'>> {
    return await this.usersService.getUserById(id);
  }

  @HttpCode(201)
  @Post()
  async createUser(@Body() user): Promise<string> {
    throw new BadGatewayException('Out of service.');
    return await this.usersService.createUser(user);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: Partial<CreateUserDto>,
  ): Promise<{ id: string }> {
    return await this.usersService.updateUser(id, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ id: string }> {
    return await this.usersService.deleteUser(id);
  }
}
