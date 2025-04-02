import { BaseEntityWithMeta } from 'src/abstract';
import { Ticket } from 'src/modules/tickets/entities/ticket.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Event extends BaseEntityWithMeta {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @Column({ default: true })
  isActive: boolean;
}
