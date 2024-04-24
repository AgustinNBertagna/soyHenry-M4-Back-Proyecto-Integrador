import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { UsersModule } from '../../src/users/users.module';
import { ProductsModule } from '../../src/products/products.module';
import { AuthModule } from '../../src/auth/auth.module';
import { CategoriesModule } from '../../src/categories/categories.module';
import { OrdersModule } from '../../src/orders/orders.module';
import { FilesModule } from '../../src/files/files.module';
import typeOrmConfig from './mockDb.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm') as TypeOrmModule,
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    FilesModule,
    AuthModule,
    UsersModule,
  ],
})
export class MockAppModule {}
