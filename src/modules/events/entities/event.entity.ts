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

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.event, { nullable: true })
  tickets?: Ticket[];

  @Column({ default: true })
  isActive: boolean;
}
