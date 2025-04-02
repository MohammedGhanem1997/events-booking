import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../user-identity/entities/staff.entity';
import { Customer } from '../user-identity/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { UserIdentityService } from '../user-identity/user-identity.service';
import { BaseService } from 'src/abstract';
import { Actions } from './type/action';
import { PermissionService } from '../permission/permission.service';
import { RoleService } from '../role/role.service';
@Injectable()
export class AuthService extends BaseService {
  constructor(
    private jwtService: JwtService,
    private userIdentityService: UserIdentityService,
    private permissionService: PermissionService,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Staff) private staffRepo: Repository<Staff>,
  ) {
    super();
  }

  async validateUser(email: string, password: string) {
    const user =
      (await this.userIdentityService.findCustomerByEmail(email)) ||
      (await this.userIdentityService.findeStaffByEmail(email));
    console.log(user);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      console.log(result);

      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getPermission(staffDetails: any, slug: string, action: string) {
    try {
      // Map HTTP methods to your custom actions
      let permissionAction: string;
      switch (action) {
        case Actions.GET:
          permissionAction = Actions.VIEW;
          break;
        case Actions.POST:
          permissionAction = Actions.ADD;
          break;
        case Actions.PUT:
        case Actions.PATCH:
          permissionAction = Actions.UPDATE;
          break;
        case Actions.DELETE:
          permissionAction = Actions.DELETE;
          break;
        default:
          permissionAction = action; // Use directly if custom action
      }

      const staffPermissions = await this.permissionService.getPermissions(
        staffDetails.id,
      );

      if (!staffPermissions) {
        throw new Error('No permissions found');
      }

      // Check for exact path and action match
      const hasPermission = staffPermissions.some(
        (permission) =>
          permission.path === slug && permission.action === permissionAction,
      );

      if (!hasPermission) {
        throw new Error('Permission Denied');
      }

      return true;
    } catch (error) {
      // Use your custom error handler
      this.customErrorHandle(error);
      return false;
    }
  }
}
