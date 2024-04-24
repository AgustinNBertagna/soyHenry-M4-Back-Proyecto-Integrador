import { Controller, Get, HttpCode } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '../entities/Category.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(201)
  @Get('seeder')
  async addCategories(): Promise<{ message: string }> {
    return await this.categoriesService.addCategories();
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories();
  }
}
