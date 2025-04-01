import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserIdentityService } from 'src/modules/user-identity/user-identity.service';
import { AuthService } from '../auth.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly userIdentityService: UserIdentityService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();
    const url = request.url.trim();
    const slug = url.split('/');
    if (request?.user) {
      const userRecord: any = await this.userIdentityService.findeStaffByEmail(
        request?.user?.email,
      );
      return await this.authService.getPermission(
        userRecord,
        slug[1],
        request?.method.toLowerCase(),
      );
    }
    return false;
  }
}
