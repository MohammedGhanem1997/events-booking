import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../user-identity/entities/customer.entity';
import { Staff } from '../user-identity/entities/staff.entity';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserIdentityService } from '../user-identity/user-identity.service';
import { PermissionService } from '../permission/permission.service';
import { RoleService } from '../role/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Staff, Role, Permission, RoleService]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserIdentityService,
    PermissionService,
    RoleService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
