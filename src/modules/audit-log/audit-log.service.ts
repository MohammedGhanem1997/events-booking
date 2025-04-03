// src/audit/audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { AuditLog } from './entity/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async logCreate(
    entityType: string,
    entityId: number,
    newValue: any,
    user?: any,
    request?: Request | any,
  ): Promise<AuditLog> {
    return this.auditLogRepository.save({
      action: 'CREATE',
      entityType,
      entityId,
      newValue,
      performedBy: user ? { id: user.id } : null,
      ipAddress: request?.ip,
    });
  }

  async logUpdate(
    entityType: string,
    entityId: number,
    oldValue: any,
    newValue: any,
    user?: any,
    request?: Request | any,
  ): Promise<AuditLog> {
    return this.auditLogRepository.save({
      action: 'UPDATE',
      entityType,
      entityId,
      oldValue,
      newValue,
      performedBy: user ? { id: user.id } : null,
      ipAddress: request?.ip,
    });
  }

  async logDelete(
    entityType: string,
    entityId: number,
    oldValue: any,
    user?: any,
    request?: Request | any,
  ): Promise<AuditLog> {
    return this.auditLogRepository.save({
      action: 'DELETE',
      entityType,
      entityId,
      oldValue,
      performedBy: user ? { id: user.id } : null,
      ipAddress: request?.ip,
    });
  }

  async getLogsForEntity(
    entityType: string,
    entityId: number,
    limit = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entityType, entityId },
      order: { performedAt: 'DESC' },
      take: limit,
      relations: ['performedBy'],
    });
  }
}
