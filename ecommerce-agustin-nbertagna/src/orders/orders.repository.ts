import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { Order } from '../entities/Order.entity';
import { OrderDetails } from '../entities/OrderDetails.entity';
import { Product } from '../entities/Product.entity';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(OrderDetails)
    private readonly ordersDetailsRepository: Repository<OrderDetails>,
  ) {}

  async getOrder(id: string): Promise<Order> {
    const order: Order | null = await this.ordersRepository.findOne({
      where: { id },
      relations: { orderDetails: { products: true } },
    });
    if (!order) throw new NotFoundException('Order not found.');
    return order;
  }

  async addOrder(orderData: CreateOrderDto): Promise<Order> {
    const { userId, products } = orderData;
    const user: User | null = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new NotFoundException('User not found.');
    let total: number = 0;
    const order: Order = this.ordersRepository.create({
      date: new Date(),
      user,
    });
    await this.ordersRepository.save(order);
    const orderDetailsProducts: Product[] = await Promise.all(
      products.map(async ({ id }) => {
        const product: Product | null = await this.productsRepository.findOneBy(
          { id },
        );
        if (!product) throw new NotFoundException('Product not found.');
        if (product.stock < 1)
          throw new ConflictException('Insufficient stock to place the order.');
        total += Number(product.price);
        await this.productsRepository.update(id, { stock: product.stock - 1 });
        return product;
      }),
    );
    const orderDetails: OrderDetails = this.ordersDetailsRepository.create({
      price: Number(Number(total).toFixed(2)),
      products: orderDetailsProducts,
    });
    await this.ordersDetailsRepository.save(orderDetails);
    order.orderDetails = orderDetails;
    await this.ordersRepository.save(order);
    return (await this.ordersRepository.findOne({
      where: { id: order.id },
      relations: { orderDetails: true },
    })) as Order;
  }
}
