import { BaseEntityWithId } from 'src/abstract';
import { Role } from 'src/modules/role/entities/role.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Permission extends BaseEntityWithId {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'varchar', nullable: false })
  action: string; // e.g., 'create', 'read', 'update', 'delete'

  @Column({ type: 'varchar', nullable: false })
  path: string; // e.g., '/users', '/users/:id'

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
