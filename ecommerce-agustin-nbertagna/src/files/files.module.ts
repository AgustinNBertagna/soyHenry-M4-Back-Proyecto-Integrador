import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { cloudinaryConfig } from '../config/cloudinary.config';
import { FilesRepository } from './files.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/Product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [FilesController],
  providers: [cloudinaryConfig, FilesService, FilesRepository],
})
export class FilesModule {}
