import { BaseEntityWithId } from 'src/abstract';
import { Customer } from 'src/modules/user-identity/entities/customer.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Ticket } from 'src/modules/tickets/entities/ticket.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Ticket)
  ticket: Ticket;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtPurchase: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}
