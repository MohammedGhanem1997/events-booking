import { Module } from '@nestjs/common';
import { UserIdentityService } from './user-identity.service';
import { UserIdentityController } from './user-identity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Customer } from './entities/customer.entity';
import { Staff } from './entities/staff.entity';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Customer, Staff, Role, Permission]),
  ],
  controllers: [UserIdentityController],
  providers: [UserIdentityService],
})
export class UserIdentityModule {}
