import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from 'src/roles.enum';

export const Roles = (...roles: Role[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
