import {
  Controller,
  HttpCode,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/entities/Product.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(201)
  @Get('seeder')
  async addProducts(): Promise<{ message: string }> {
    return await this.productsService.addProducts();
  }

  @Get()
  async getProducts(): Promise<Product[]> {
    return await this.productsService.getProducts();
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @HttpCode(201)
  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() product): Promise<{ id: string }> {
    return await this.productsService.createProduct(product);
  }

  @ApiBearerAuth()
  @HttpCode(201)
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id,
    @Body() product,
  ): Promise<{ id: string }> {
    return await this.productsService.updateProduct(id, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id', ParseUUIDPipe) id): Promise<{ id: string }> {
    return await this.productsService.deleteProduct(id);
  }
}
