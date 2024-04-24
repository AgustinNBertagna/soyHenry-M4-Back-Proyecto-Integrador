import {
  IsUUID,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  /**
   * Product ID must be a UUID string.
   * @example "e6719df7-05a0-4d66-9f96-0d516b25e1fc"
   */
  @IsNotEmpty({ message: 'Missing product ID.' })
  @IsUUID('4', { message: 'Product ID must be a UUID string.' })
  id: string;
}

export class CreateOrderDto {
  /**
   * User ID must be a UUID string.
   * @example "912a159c-f2e3-47af-9d07-b82342f18459"
   */
  @IsNotEmpty({ message: 'Missing user ID.' })
  @IsUUID('4', { message: 'User ID must be a UUID string.' })
  userId: string;

  /**
   * Array of objects with products ID.
   * @example [ { id: "5eff132f-54ee-40f2-bc69-046481ed7194" }, { id: "33af0f6c-cd7e-4928-8e76-104d45f078b4" } ]
   */
  @ArrayMinSize(1, { message: 'Missing product/s.' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
