import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from '../user-identity/entities/staff.entity';
import { Role } from '../role/entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RoleService } from '../role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Role, Permission])],

  controllers: [PermissionController],
  providers: [PermissionService, RoleService],
})
export class PermissionModule {
  constructor(private permissionService: PermissionService) {}
}
