import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEmail,
  Length,
  IsStrongPassword,
  IsOptional,
  IsEmpty,
} from 'class-validator';

export class CreateUserDto {
  /**
   * Name must have at least 3 characters and a maximum of 80.
   * @example "Agustin Bertagna"
   */
  @IsNotEmpty({ message: 'Missing user name.' })
  @IsString({ message: 'Name must be a string.' })
  @Length(3, 80, {
    message: 'Name must have at least 3 characters and a maximum of 80.',
  })
  name: string;

  /**
   * Email must have @ and dot domain.
   * @example "agustin@gmail.com"
   */
  @IsNotEmpty({ message: 'Missing email.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  /**
   * Password must have at least 8 characters and a maximum of 15 and must contain at least one uppercase letter, one lowercase letter, a number and a symbol.
   * @example "!MIContraseña1"
   */
  @IsNotEmpty({ message: 'Missing password.' })
  @Length(8, 15, {
    message: 'Password must have at least 8 characters and a maximum of 15.',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, a number and a symbol.',
    },
  )
  password: string;

  /**
   * Confirm password must be equal to Password.
   * @example "!MIContraseña1"
   */
  @IsNotEmpty({ message: 'Missing confirm password.' })
  @Length(8, 15, {
    message:
      'Confirm password must have at least 8 characters and a maximum of 15.',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Confirm password must contain at least one uppercase letter, one lowercase letter, a number and a symbol.',
    },
  )
  confirmPassword: string;

  /**
   * Address must have at least 3 characters and a maximum of 80.
   * @example "Hipolito Yrigoyen 123"
   */
  @IsNotEmpty({ message: 'Missing address.' })
  @IsString({ message: 'Address must be a string.' })
  @Length(3, 80, {
    message: 'Address must have at least 3 characters and a maximum of 80.',
  })
  address: string;

  /**
   * Phone number must be a number.
   * @example 3298378
   */
  @IsNotEmpty({ message: 'Phone number missing.' })
  @IsInt({ message: 'Phone number must be a number.' })
  phone: number;

  /**
   * Country is optional but if exists must have at least 5 characters and a maximum of 20.
   * @example "Argentina"
   */
  @IsOptional()
  @IsString({ message: 'Country must be a string.' })
  @Length(5, 20, {
    message: 'Country must have at least 5 characters and a maximum of 20.',
  })
  country: string;

  /**
   * City is optional but if exists must have at least 5 characters and a maximum of 20.
   * @example "Cordoba, Capital"
   */
  @IsOptional()
  @IsString({ message: 'City must be a string.' })
  @Length(5, 20, {
    message: 'City must have at least 5 characters and a maximum of 20.',
  })
  city: string;

  /**
   * isAdmin is not included in the request body. Aims to false by default.
   * @default false
   */
  @ApiHideProperty()
  @IsEmpty()
  isAdmin: boolean;
}
