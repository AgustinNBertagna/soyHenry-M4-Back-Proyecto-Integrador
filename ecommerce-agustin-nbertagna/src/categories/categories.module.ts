import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/Category.entity';
import { Product } from '../entities/Product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule implements OnApplicationBootstrap {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  async onApplicationBootstrap() {
    await this.categoriesRepository.addCategories();
  }
}
