import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @UpdateDateColumn({
    type: 'timestamp',

    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: string;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt: string;
}

export abstract class BaseEntityWithId extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}

export abstract class BaseEntityWithMeta extends BaseEntityWithId {
  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updatedBy: string;
}
