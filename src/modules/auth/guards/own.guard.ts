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
    const userId = user.id;

    // If the user has no role, assume it's a customer
    if (!user.role) {
      console.log('userId->', userId);

      // Inject userId into query parameters
      if (request.method === 'GET' || request.method === 'DELETE') {
        request.query.customerId = userId;
      } else if (request.method === 'POST' || request.method === 'PUT') {
        if (request.body.customerId && request.body.customerId !== userId) {
          throw new ForbiddenException('You can only access your own data.');
        }
        request.body.customerId = userId;
      }
    } else {
      if (request.method === 'POST') {
        request.body.createdBy = userId.toString();
      }
      if (request.method === 'PUT') {
        request.body.updatedBy = userId.toString();
      }
    }

    return true;
  }
}
