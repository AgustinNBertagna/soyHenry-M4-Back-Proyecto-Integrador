import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as data from '../products.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/Product.entity';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category.entity';
import { OrderDetails } from '../entities/OrderDetails.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(OrderDetails)
    private readonly ordersDetailsRepository: Repository<OrderDetails>,
  ) {}

  private products = [
    {
      id: 1,
      name: 'Laptop',
      description: 'Powerful laptop with high-resolution display',
      price: 999.99,
      stock: true,
      imgUrl: 'https://example.com/laptop.jpg',
    },
    {
      id: 2,
      name: 'Smartphone',
      description: 'Latest smartphone with dual cameras',
      price: 599.99,
      stock: false,
      imgUrl: 'https://example.com/smartphone.jpg',
    },
    {
      id: 3,
      name: 'Headphones',
      description: 'Wireless noise-canceling headphones',
      price: 149.99,
      stock: true,
      imgUrl: 'https://example.com/headphones.jpg',
    },
    {
      id: 4,
      name: 'Fitness Tracker',
      description: 'Waterproof fitness tracker with heart rate monitor',
      price: 79.99,
      stock: false,
      imgUrl: 'https://example.com/fitness-tracker.jpg',
    },
    {
      id: 5,
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with built-in grinder',
      price: 49.99,
      stock: true,
      imgUrl: 'https://example.com/coffee-maker.jpg',
    },
  ];

  async addProducts(): Promise<{ message: string }> {
    const categories = await this.categoriesRepository.find();
    if (!categories.length)
      throw new NotFoundException('Categories not found.');
    const products = await this.productsRepository.find();
    if (!products.length) {
      await Promise.all(
        data.map(async (productData) => {
          const foundCategory = (await this.categoriesRepository.findOneBy({
            name: productData.category,
          })) as Category;
          const newProduct = this.productsRepository.create({
            ...productData,
            category: foundCategory,
          });
          await this.productsRepository.save(newProduct);
          return 'Products seeded.';
        }),
      );
      return { message: 'Products seeded.' };
    }
    const message = await Promise.all(
      data.map(async (productData) => {
        const foundCategory = (await this.categoriesRepository.findOneBy({
          name: productData.category,
        })) as Category;
        const foundProduct = await this.productsRepository.findOneBy({
          name: productData.name,
        });
        if (!foundProduct) return;
        const ordersDetails = await this.ordersDetailsRepository
          .createQueryBuilder('orderDetails')
          .leftJoinAndSelect('orderDetails.products', 'products')
          .where('products.id = :productId', { productId: foundProduct.id })
          .getMany();
        if (ordersDetails.length)
          return "Products that don't belong to an order detail reseeded.";
        const newProduct = this.productsRepository.create({
          ...productData,
          category: foundCategory,
        });
        await this.productsRepository.save(newProduct);
        await this.productsRepository.delete(foundProduct.id);
      }),
    ).then((messages) =>
      messages.includes(
        "Products that don't belong to an order detail reseeded.",
      )
        ? 'Products that don\t belong to an order detail reseeded.'
        : 'Products reseeded.',
    );
    return { message };
  }

  async getProdutcts(): Promise<Product[]> {
    const products: Product[] = await this.productsRepository.find({
      relations: { category: true },
    });
    if (products.length === 0)
      throw new NotFoundException('Products not found.');
    return products;
  }

  async getProductById(id: string): Promise<Product> {
    const product: Product | null = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  async createProduct(product): Promise<{ id: string }> {
    const newProduct: Product = this.productsRepository.create({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: product.imgUrl,
    });
    const categoryFound: Category | null =
      await this.categoriesRepository.findOneBy({ name: product.category });
    if (!categoryFound) throw new NotFoundException(`Category not found.`);
    newProduct.category = categoryFound;
    await this.productsRepository.save(newProduct);
    return { id: newProduct.id };
  }

  async updateProduct(id: string, product): Promise<{ id: string }> {
    const foundProduct: Product | null =
      await this.productsRepository.findOneBy({ id });
    if (!foundProduct) throw new NotFoundException('Product not found.');
    await this.productsRepository.update(id, product);
    return { id: foundProduct.id };
  }

  async deleteProduct(id: string): Promise<{ id: string }> {
    const product: Product | null = await this.productsRepository.findOneBy({
      id,
    });
    if (!product) throw new NotFoundException('Product not found.');
    await this.productsRepository.delete(id);
    return { id: product.id };
  }
}
