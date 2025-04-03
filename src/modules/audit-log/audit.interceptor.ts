import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, user, body, params } = request;
    const entityType = this.getEntityType(request);

    // For GET requests, skip auditing
    if (method === 'GET') {
      return next.handle();
    }

    // Store the current state for UPDATE/DELETE
    let oldValue: any;
    if (['PUT', 'PATCH', 'DELETE'].includes(method)) {
      // You would need to fetch the current entity state here
      // This is a placeholder - implement based on your actual entities
      oldValue = null;
    }

    return next.handle().pipe(
      tap((response) => {
        const entityId = response?.id || params?.id;

        switch (method) {
          case 'POST':
            this.auditLogService.logCreate(
              entityType,
              entityId,
              body,
              user,
              request,
            );
            break;
          case 'PUT':
          case 'PATCH':
            this.auditLogService.logUpdate(
              entityType,
              entityId,
              oldValue,
              body,
              user,
              request,
            );
            break;
          case 'DELETE':
            this.auditLogService.logDelete(
              entityType,
              entityId,
              oldValue,
              user,
              request,
            );
            break;
        }
      }),
    );
  }

  private getEntityType(request: Request): string {
    // Extract entity type from URL (e.g., '/events/123' → 'events')
    return request.path.split('/')[1];
  }
}
