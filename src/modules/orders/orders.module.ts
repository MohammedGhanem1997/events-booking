import { Logger, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/rder-item.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Order } from './entities/order.entity';
import { AuthModule } from '../auth/auth.module';
import { EventsService } from '../events/events.service';
import { Customer } from '../user-identity/entities/customer.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Event, Ticket, Customer]),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, EventsService, Logger, NotificationsService],
})
export class OrdersModule {}
