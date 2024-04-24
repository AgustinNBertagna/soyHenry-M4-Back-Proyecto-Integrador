import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/Order.entity';
import { User } from '../entities/User.entity';
import { Product } from '../entities/Product.entity';
import { OrderDetails } from '../entities/OrderDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetails, User, Product])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
