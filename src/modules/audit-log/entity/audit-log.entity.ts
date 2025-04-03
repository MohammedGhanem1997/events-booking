import { Staff } from 'src/modules/user-identity/entities/staff.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // 'CREATE', 'UPDATE', 'DELETE'

  @Column()
  entityType: string;

  @Column({ nullable: true })
  entityId: number;

  @Column('simple-json', { nullable: true })
  oldValue: any;

  @Column('simple-json', { nullable: true })
  newValue: any;

  @ManyToOne(() => Staff, (user) => user.auditLogs, { nullable: true })
  performedBy: Staff | number;

  @CreateDateColumn()
  performedAt: Date;
}
