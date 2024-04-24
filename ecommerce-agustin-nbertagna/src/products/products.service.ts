import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from 'src/entities/Product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async addProducts(): Promise<{ message: string }> {
    return await this.productsRepository.addProducts();
  }

  async getProducts(): Promise<Product[]> {
    return await this.productsRepository.getProdutcts();
  }

  async getProductById(id: string): Promise<Product> {
    return await this.productsRepository.getProductById(id);
  }

  async createProduct(product): Promise<{ id: string }> {
    return await this.productsRepository.createProduct(product);
  }

  async updateProduct(id: string, product): Promise<{ id: string }> {
    return await this.productsRepository.updateProduct(id, product);
  }

  async deleteProduct(id: string): Promise<{ id: string }> {
    return await this.productsRepository.deleteProduct(id);
  }
}
