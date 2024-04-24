import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from '../entities/Category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async addCategories(): Promise<{ message: string }> {
    return await this.categoriesRepository.addCategories();
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.getCategories();
  }
}
