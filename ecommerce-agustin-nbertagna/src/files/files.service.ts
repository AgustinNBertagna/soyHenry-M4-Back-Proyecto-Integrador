import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/Product.entity';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async uploadImage(id: string, file: Express.Multer.File): Promise<string> {
    const product: Product | null = await this.productsRepository.findOneBy({
      id,
    });
    if (!product) throw new NotFoundException('User not found.');
    const uploadedImage: UploadApiResponse =
      await this.filesRepository.uploadImage(file);
    const { secure_url } = uploadedImage;
    await this.productsRepository.update(id, { imgUrl: secure_url });
    return `${product.name} file image successfully updated.`;
  }
}
