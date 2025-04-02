import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from '../user-identity/entities/staff.entity';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { PermissionService } from '../permission/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Role, Permission])],
  controllers: [RoleController],
  providers: [RoleService, PermissionService],
})
export class RoleModule {}
