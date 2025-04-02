import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If the user has no role, assume it's a customer
    if (!user.role) {
      const userId = user.id;

      // Inject userId into query parameters
      if (request.method === 'GET' || request.method === 'DELETE') {
        request.query.userId = userId;
      } else if (request.method === 'POST' || request.method === 'PUT') {
        if (request.body.userId && request.body.userId !== userId) {
          throw new ForbiddenException('You can only access your own data.');
        }
        request.body.userId = userId;
      }
    }

    return true;
  }
}
