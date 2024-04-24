import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/Category.entity';
import { Repository } from 'typeorm';
import * as data from '../products.json';
import { Product } from '../entities/Product.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async addCategories(): Promise<{ message: string }> {
    const categoriesNames: string[] = [
      ...new Set(data.map((el) => el.category)),
    ];
    const categories = await this.categoriesRepository.find();
    if (!categories.length) {
      await Promise.all(
        categoriesNames.map(async (name) => {
          const category = this.categoriesRepository.create({ name });
          await this.categoriesRepository.save(category);
        }),
      );
      return { message: 'Categories seeded.' };
    }
    const message = await Promise.all(
      categories.map(async (category) => {
        const products = await this.productsRepository.findBy({ category });
        const newCategory = this.categoriesRepository.create({
          name: category.name,
        });
        await this.categoriesRepository.save(newCategory);
        await Promise.all(
          products.map(async (product) => {
            await this.productsRepository.update(product.id, {
              category: newCategory,
            });
          }),
        );
        await this.categoriesRepository.delete(category.id);
        return products.length
          ? 'Categories and products reseeded.'
          : 'Categories reseeded.';
      }),
    ).then((message) => message[0]);
    return { message };
  }

  async getCategories() {
    const categories: Category[] = await this.categoriesRepository.find();
    if (categories.length === 0)
      throw new NotFoundException('Categories not found.');
    return categories;
  }
}
