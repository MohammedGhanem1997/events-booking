import { BaseEntityWithId } from 'src/abstract';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Staff } from 'src/modules/user-identity/entities/staff.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Role extends BaseEntityWithId {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Staff, (staff) => staff.role)
  staff: Staff[];

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
