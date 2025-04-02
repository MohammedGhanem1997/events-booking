import { Logger, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/rder-item.entity';
import { Event } from './entities/event.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { AuthModule } from '../auth/auth.module';
import { SearchService } from '../search/search.service';
import { TicketsService } from '../tickets/tickets.service';
import { Customer } from '../user-identity/entities/customer.entity';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Event, Ticket, Customer]),
    AuthModule,
  ],

  controllers: [EventsController],
  providers: [EventsService, SearchService, TicketsService, Logger],
})
export class EventsModule {}
