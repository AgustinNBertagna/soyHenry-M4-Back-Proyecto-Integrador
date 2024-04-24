import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { Order } from '../entities/Order.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return await this.ordersService.getOrder(id);
  }

  @ApiBearerAuth()
  @HttpCode(201)
  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() orderData: CreateOrderDto): Promise<Order> {
    return await this.ordersService.addOrder(orderData);
  }
}
