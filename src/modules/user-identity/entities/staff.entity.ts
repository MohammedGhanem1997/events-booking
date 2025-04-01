import * as bcrypt from 'bcrypt';
import { BaseEntityWithMeta } from 'src/abstract';
import { Role } from 'src/modules/role/entities/role.entity';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Staff extends BaseEntityWithMeta {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.staff)
  role: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
