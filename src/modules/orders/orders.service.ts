import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Order } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/abstract';
import {
  Between,
  Connection,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { OrderItem } from './entities/rder-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from '../user-identity/entities/customer.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class OrdersService extends BaseService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly connection: Connection,
  ) {
    super();
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    customerId: number,
  ): Promise<Order> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the order
      const order = new Order();
      order.customer = { id: customerId } as Customer;
      order.status = 'pending';
      order.orderDate = new Date();
      console.log('totalAmount', order);
      let totalAmount = 0;
      order.totalAmount = totalAmount;

      const savedOrder = await queryRunner.manager.save(order);

      const orderItems: OrderItem[] = [];

      // Process each item in the order
      console.log('totalAmount', totalAmount);

      for (const item of createOrderDto.items) {
        const ticket = await queryRunner.manager.findOne(Ticket, {
          where: { id: item.ticketId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!ticket || ticket.quantityAvailable < item.quantity) {
          this._getBadRequestError(
            `Insufficient tickets available" ${item.ticketId}`,
          );
        }

        // Update ticket availability
        ticket.quantityAvailable -= item.quantity;
        await queryRunner.manager.save(ticket);

        // Create order item
        const orderItem = new OrderItem();
        orderItem.order = order;
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

  async confirmOrder(
    orderId: number,
    paymentReference: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      this._getNotFoundError('Order not found');
    }

    if (order.status !== 'pending') {
      this._getBadRequestError('Order cannot be confirmed');
    }

    order.status = 'confirmed';
    order.paymentReference = paymentReference;

    return this.orderRepository.save(order);
  }

  async findOrdersByCustomer(
    query: OrderQueryDto,
    customerId?: number,
  ): Promise<Pagination<OrderResponseDto, IPaginationMeta>> {
    try {
      const { sort, page = 1, limit = 10 } = query || {};

      const qb: SelectQueryBuilder<Order> = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'orderItem')
        .leftJoinAndSelect('orderItem.ticket', 'ticket')
        .leftJoinAndSelect('ticket.event', 'event')
        .leftJoinAndSelect('order.customer', 'customer');
      if (customerId || customerId != null) {
        qb.where('customer.id = :customerId', { customerId });
      }

      // Filtering by date range
      if (query?.fromDate && query?.toDate) {
        qb.andWhere('order.orderDate BETWEEN :fromDate AND :toDate', {
          fromDate: query.fromDate,
          toDate: query.toDate,
        });
      } else if (query?.fromDate) {
        qb.andWhere('order.orderDate >= :fromDate', {
          fromDate: query.fromDate,
        });
      } else if (query?.toDate) {
        qb.andWhere('order.orderDate <= :toDate', { toDate: query.toDate });
      }

      // Filtering by status
      if (query?.status) {
        qb.andWhere('order.status = :status', { status: query.status });
      }

      // Sorting
      const allowedFieldsToSort = ['orderDate', 'status'];
      if (sort) {
        const [field, direction] = this.buildSortParams<{
          orderDate: Date;
          status: string;
        }>(sort);

        if (allowedFieldsToSort.includes(field)) {
          qb.orderBy(`order.${field}`, direction);
        }
      }

      // Paginate results
      const result = await this._paginate<Order>(qb, {
        page,
        limit,
      });
      // Map orders to DTOs
      const mappedOrders = result.items.map((order) =>
        this.mapToOrderResponseDto(order),
      );

      // Return a new paginated response with the mapped items
      return {
        ...result,
        items: mappedOrders,
      };
    } catch (error) {
      console.error(error);
      this.customErrorHandle(error);
    }
  }

  async findOrderById(
    orderId: number,
    customerId?: number,
  ): Promise<OrderResponseDto> {
    const where: any = { id: orderId };
    if (customerId) {
      where.customer = { id: customerId };
    }

    const order = await this.orderRepository.findOne({
      where,
      relations: ['items', 'items.ticket', 'items.ticket.event', 'customer'],
    });

    if (!order) {
      this._getNotFoundError(`Order with ID ${orderId} not found`);
    }

    return this.mapToOrderResponseDto(order);
  }

  private mapToOrderResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: `ORD-${order.id.toString().padStart(6, '0')}`,
      customerEmail: order.customer.email,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      items: order.items.map((item) => ({
        id: item.id,
        ticketId: item.ticket.id,
        ticketType: item.ticket.type,
        eventName: item.ticket.event.name,
        quantity: item.quantity,
        price: item.priceAtPurchase,
        subtotal: item.subtotal,
      })),
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      status: order.status,
      paymentStatus: this.getPaymentStatus(order),
    };
  }

  private getPaymentStatus(order: Order): string {
    if (order.status === 'cancelled') return 'refunded';
    if (order.paymentReference) return 'paid';
    return 'pending';
  }
}
