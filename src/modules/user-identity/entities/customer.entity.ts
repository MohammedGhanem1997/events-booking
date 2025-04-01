import * as bcrypt from 'bcrypt';
import { BaseEntityWithId } from 'src/abstract';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity()
export class Customer extends BaseEntityWithId {
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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
