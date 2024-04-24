import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

export const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
  .setTitle('Ecommerce - Agustín N Bertagna')
  .setDescription(
    "REST API built in NestJS for the integrative project of module 4 of Henry's FullStack course.",
  )
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
