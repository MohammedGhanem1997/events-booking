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
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditLog } from '../audit-log/entity/audit-log.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Event,
      Ticket,
      Customer,
      AuditLog,
    ]),
    AuthModule,
    AuditLogModule,
  ],

  controllers: [EventsController],
  exports: [AuditLogModule],
  providers: [EventsService, SearchService, TicketsService, Logger],
})
export class EventsModule {}
