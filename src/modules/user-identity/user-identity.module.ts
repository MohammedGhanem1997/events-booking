import { Module } from '@nestjs/common';
import { UserIdentityService } from './user-identity.service';
import { UserIdentityController } from './user-identity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Customer])],
  controllers: [UserIdentityController],
  providers: [UserIdentityService],
})
export class UserIdentityModule {}
