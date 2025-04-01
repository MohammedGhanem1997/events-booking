import * as bcrypt from 'bcrypt';
import { BaseEntityWithMeta } from 'src/abstract';
import { Role } from 'src/modules/role/entities/role.entity';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Staff extends BaseEntityWithMeta {
  @Column({ unique: true })
  email: string;
  @Column({ type: 'varchar', length: 30 })
  firstName: string;
  @Column({ type: 'varchar', length: 30 })
  lastName: string;
  @Column({ type: 'varchar', length: 30 })
  phoneNumber: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @ManyToOne(() => Role, (role) => role.staff)
  role: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
