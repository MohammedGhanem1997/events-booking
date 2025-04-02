import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleService } from '../role/role.service';

const CACHE_TTL = 300000;
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    private roleService: RoleService,
  ) {}

  private permissionCache = new Map<
    string,
    { expires: number; permissions: any[] }
  >();

  async getPermissions(userId: string) {
    if (this.permissionCache.has(userId)) {
      const cached = this.permissionCache.get(userId);
      if (cached.expires > Date.now()) {
        return cached.permissions;
      }
    }
    let staff = {
      staff: { id: userId },
    };
    const role = await this.roleService.find(staff);
    this.permissionCache.set(userId, {
      expires: Date.now() + CACHE_TTL,
      permissions: role.permissions,
    });

    return role.permissions;
  }
  async findByRoles(roleIds: string[]): Promise<Permission[]> {
    return this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoin('permission.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();
  }
}
