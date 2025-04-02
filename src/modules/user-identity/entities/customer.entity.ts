import * as bcrypt from 'bcrypt';
import { BaseEntityWithId } from 'src/abstract';
import { Order } from 'src/modules/orders/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

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

  @OneToMany(() => Order, (order) => order.customer, { cascade: true })
  orders: Order[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
