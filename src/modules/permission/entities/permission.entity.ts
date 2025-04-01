import { BaseEntityWithId } from 'src/abstract';
import { Column, Entity } from 'typeorm';

@Entity()
export class Permission extends BaseEntityWithId {
  @Column({ default: true })
  name: string;

  @Column()
  urlPath: string;

  @Column('enum', { enum: ['add', 'view', 'delete', 'edit'] })
  action: 'add' | 'view' | 'delete' | 'edit';
}
