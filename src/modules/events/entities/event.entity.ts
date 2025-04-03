import { BaseEntityWithMeta } from 'src/abstract';
import { Ticket } from 'src/modules/tickets/entities/ticket.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity()
export class Event extends BaseEntityWithMeta {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  @Index() // Index for location-based searches
  location: string;

  @Column({ type: 'timestamp' })
  @Index() // Index for event date-based queries
  startDate: Date;

  @Column({ type: 'timestamp' })
  @Index() // Index for finding active/future events
  endDate: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.event, {
    nullable: true,
    cascade: true,
  })
  tickets?: Ticket[];

  @Column({ default: true })
  isActive: boolean;
}
