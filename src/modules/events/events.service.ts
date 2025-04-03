import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Connection, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
import { SearchService } from '../search/search.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Customer } from '../user-identity/entities/customer.entity';
import { Event } from './entities/event.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItemDto } from '../orders/dto/order-item.dto';
import { BaseService } from 'src/abstract';
import { OrderItem } from '../orders/entities/rder-item.entity';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RESPONSE_MESSAGES } from 'src/types/responseMessages';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class EventsService extends BaseService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly searchService: SearchService,
    private readonly connection: Connection,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly logger: Logger,
    private auditLogService: AuditLogService,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    super();
  }

  async createEvent(
    createEventDto: CreateEventDto,
    staffId?: number,
  ): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
    });
    const savedEvent = await this.eventRepository.save(event);

    // Index in Elasticsearch
    // await this.searchService.indexEvent(savedEvent);
    await this.auditLogService.logCreate(
      'Event',
      savedEvent.id,
      savedEvent,
      staffId,
      createEventDto,
    );
    return savedEvent;
  }

  async searchEvents(query: string): Promise<EventDocument[]> {
    return this.searchService.searchEvents(query);
  }

  async bookTickets(
    createOrderDto: CreateOrderDto,
    customerId: number,
  ): Promise<Order> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify customer exists
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        this._getNotFoundError('Customer not found');
      }

      // Create the order
      const order = new Order();
      order.customer = customer;
      order.status = 'pending';
      order.orderDate = new Date();

      const savedOrder = await queryRunner.manager.save(order);

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // Process each ticket in the order
      for (const item of createOrderDto.items) {
        const ticket = await queryRunner.manager.findOne(Ticket, {
          where: { id: item.ticketId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!ticket) {
          this._getBadRequestError(`Ticket with ID ${item.ticketId} not found`);
        }

        if (ticket.quantityAvailable < item.quantity) {
          this._getBadRequestError(
            `Not enough tickets available for ${ticket.type}. Available: ${ticket.quantityAvailable}, Requested: ${item.quantity}`,
          );
        }

        // Update ticket availability
        ticket.quantityAvailable -= item.quantity;
        await queryRunner.manager.save(ticket);

        // Create order item
        const orderItem = new OrderItem();
        orderItem.order = savedOrder;
        orderItem.ticket = ticket;
        orderItem.quantity = item.quantity;
        orderItem.priceAtPurchase = ticket.price;
        orderItem.subtotal = ticket.price * item.quantity;

        totalAmount += orderItem.subtotal;
        orderItems.push(orderItem);
      }

      // Save all order items
      await queryRunner.manager.save(orderItems);

      // Update order total
      savedOrder.totalAmount = totalAmount;
      const finalOrder = await queryRunner.manager.save(savedOrder);

      await queryRunner.commitTransaction();

      return finalOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllActiveEvents(
    query,
  ): Promise<Pagination<Event, IPaginationMeta>> {
    try {
      const { sort, page = 1, limit = 10 } = query;
      const qb: SelectQueryBuilder<Event> = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.tickets', 'ticket')
        .leftJoinAndSelect('ticket.orderItems', 'orderItem')
        .where('event.isActive = :isActive', { isActive: true });
      // .andWhere('event.endDate > :now', { now: new Date() });

      // Filtering
      if (query.name) {
        qb.andWhere('event.name LIKE :name', { name: `%${query.name}%` });
      }
      if (query.availability === 'true') {
        qb.andWhere(
          '(SELECT SUM(t."quantityAvailable") FROM ticket t WHERE t."eventId" = event.id) > 0',
        );
      }
      if (query.availability === 'false') {
        qb.andWhere(
          '(SELECT SUM(t."quantityAvailable") FROM ticket t WHERE t."eventId" = event.id) < 1',
        );
      }

      if (query.description) {
        qb.andWhere('event.description LIKE :description', {
          description: `%${query.description}%`,
        });
      }
      if (query.location) {
        qb.andWhere('event.location LIKE :location', {
          location: `%${query.location}%`,
        });
      }

      if (query.start_date && query.end_date) {
        qb.andWhere('event.startDate BETWEEN :startDate AND :endDate', {
          startDate: query.start_date,
          endDate: query.end_date,
        });
      } else if (query.start_date) {
        qb.andWhere('event.startDate >= :startDate', {
          startDate: query.start_date,
        });
      } else if (query.end_date) {
        qb.andWhere('event.endDate <= :endDate', { endDate: query.end_date });
      }

      // Sorting
      const allowedFieldsToSort = ['name', 'startDate', 'endDate', 'location'];
      if (sort) {
        const [field, direction] = this.buildSortParams<{
          name: string;
          startDate: Date;
          endDate: Date;
          location: string;
        }>(sort);

        if (allowedFieldsToSort.includes(field)) {
          qb.orderBy(`event.${field}`, direction);
        }
      }
      let result = await this._paginate<Event>(qb, {
        page: page,
        limit: limit,
      });

      return result;
    } catch (error) {
      console.log(error);

      this.customErrorHandle(error);
    }
  }

  async findEventById(id: number, customerId?: number): Promise<Event> {
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.tickets', 'ticket')

      .where('event.id = :id', { id });

    if (customerId) {
      queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    } else {
      queryBuilder
        .leftJoinAndSelect('ticket.orderItems', 'orderItem')
        .leftJoinAndSelect('orderItem.order', 'order');
    }

    const event = await queryBuilder.getOne();

    if (!event) {
      this._getBadRequestError(
        customerId
          ? `Event with ID ${id} not found for customer ${customerId}`
          : `Event with ID ${id} not found`,
      );
    }

    return event;
  }

  async updateEvent(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        tickets: {
          orderItems: true,
        },
      },
    });

    if (!event) {
      this._getNotFoundError(`Event with ID ${id} not found`);
    }

    // Check if any ticket has order items (orders)
    const hasOrders = event.tickets.some(
      (ticket) => ticket.orderItems?.length > 0,
    );

    if (hasOrders) {
      // Additional validation for events with existing orders
      if (
        updateEventDto.startDate &&
        new Date(updateEventDto.startDate) < new Date()
      ) {
        this._getBadRequestError(
          'Cannot update start date to past when tickets have been purchased',
        );
      }
    }

    const updatedEvent = await this.eventRepository.save(event);

    await this.auditLogService.logUpdate(
      'Event',
      id,
      event,
      updatedEvent,
      updateEventDto.updatedBy,
      updateEventDto,
    );

    return updatedEvent;
  }

  async deleteEvent(id: number, user?: number): Promise<object> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id },
        relations: {
          tickets: {
            orderItems: true,
          },
        },
      });

      if (!event) {
        this._getNotFoundError(`Event with ID ${id} not found`);
      }

      // Check if any ticket has order items (orders)
      const hasOrders = event.tickets.some(
        (ticket) => ticket.orderItems?.length > 0,
      );

      if (hasOrders) {
        // Soft delete if orders exist
        // event.isActive = false;
        await this.eventRepository.softRemove(event);
      } else {
        // Hard delete if no orders
        await this.eventRepository.remove(event);
      }
      await this.auditLogService.logDelete('Event', id, event, user, {
        message: RESPONSE_MESSAGES.COMMON.DELETED_SUCCESSFULLY,
      });
      return {
        message: RESPONSE_MESSAGES.COMMON.DELETED_SUCCESSFULLY,
      };
    } catch (error) {
      this.customErrorHandle(error);
    }
    // Update search index accordingly
    // try {
    //   if (hasOrders) {
    //     await this.searchService.updateEventIndex(id, { isActive: false });
    //   } else {
    //     await this.searchService.deleteEventIndex(id);
    //   }
    // } catch (err) {
    //   this.logger.error(
    //     `Search index update failed for event ${id}`,
    //     err.stack,
    //   );
    // }
  }
}
