import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/Product.entity';
import { Category } from '../entities/Category.entity';
import { OrderDetails } from '../entities/OrderDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderDetails])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule implements OnApplicationBootstrap {
  constructor(private readonly productsRepository: ProductsRepository) {}
  async onApplicationBootstrap() {
    await this.productsRepository.addProducts();
  }
}
