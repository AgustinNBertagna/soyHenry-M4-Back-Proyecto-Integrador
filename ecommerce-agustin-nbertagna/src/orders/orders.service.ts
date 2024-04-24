import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { Order } from '../entities/Order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrder(id: string): Promise<Order> {
    return await this.ordersRepository.getOrder(id);
  }

  async addOrder(orderData: CreateOrderDto): Promise<Order> {
    return await this.ordersRepository.addOrder(orderData);
  }
}
