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
    private roleService: RoleService,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Staff) private staffRepo: Repository<Staff>,
  ) {
    super();
  }

  async validateUser(email: string, password: string) {
    const user =
      (await this.userIdentityService.findCustomerByEmail(email)) ||
      (await this.userIdentityService.findeStaffByEmail(email));

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role?.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getPermission(staffDetails: any, slug: string, action: string) {
    try {
      let method = '';
      switch (action) {
        case Actions.GET:
          method = Actions.VIEW;
          break;
        case Actions.PATCH:
          method = Actions.UPDATE;
          break;
        case Actions.DELETE:
          method = Actions.DELETE;
          break;
        case Actions.POST:
          method = Actions.ADD;
          break;
        default:
          break;
      }
      const staffPermissions =
        await this.roleService.getStaffPermissions(staffDetails);
      let returnRes: any = false;

      for (const x of staffPermissions) {
        const path = x?.urlPath;
        const actionName = x?.action;

        if (path === slug && actionName === method) {
          returnRes = true;
        }
      }
      if (returnRes) {
        return true;
      }
      throw this._getUnauthorized('Permission Denied');
    } catch (error) {
      this.customErrorHandle(error);
    }
  }
}
