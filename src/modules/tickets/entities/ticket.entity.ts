import { BaseEntityWithId } from 'src/abstract';
import { Event } from 'src/modules/events/entities/event.entity';
import { OrderItem } from 'src/modules/orders/entities/rder-item.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Ticket extends BaseEntityWithId {
  @ManyToOne(() => Event, (event) => event.tickets)
  event: Event;

  @Column()
  type: string; // "General", "VIP" ,economic

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantityAvailable: number;

  @Column()
  quantityTotal: number;
  @OneToMany(() => OrderItem, (orderItem) => orderItem.ticket)
  orderItems: OrderItem[];
}
