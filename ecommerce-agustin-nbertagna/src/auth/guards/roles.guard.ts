import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  validate(request: any, requiredRoles: Role[]): boolean {
    const user = request.user;
    const hasRole: boolean = requiredRoles.some((role) =>
      user.roles.includes(role),
    );
    const valid: boolean = user && user.roles && hasRole;
    if (!valid) throw new ForbiddenException('Denied access.');
    return valid;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest();
    return this.validate(request, requiredRoles);
  }
}
