import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entity/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],

  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogModule, AuditLogService],
})
export class AuditLogModule {}
