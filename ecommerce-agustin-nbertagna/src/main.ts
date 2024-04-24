import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './middlewares/logger.middleware';
import { swaggerConfig } from './config/swagger.config';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Validation } from './pipes/validation.pipe';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication<any> = await NestFactory.create(AppModule);
  app.use(new Logger().use);
  app.useGlobalPipes(Validation);
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
