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
} from 'typeorm';
import { OrderItem } from './entities/rder-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from '../user-identity/entities/customer.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderQueryDto } from './dto/order-query.dto';

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

      const savedOrder = await queryRunner.manager.save(order);

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // Process each item in the order
      for (const item of createOrderDto.items) {
        const ticket = await queryRunner.manager.findOne(Ticket, {
          where: { id: item.ticketId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!ticket || ticket.quantityAvailable < item.quantity) {
          this._getBadRequestError(
            `Not enough tickets available for ticket ID ${item.ticketId}`,
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
    customerId: number,
    query?: OrderQueryDto,
  ): Promise<OrderResponseDto[]> {
    const where: any = { customer: { id: customerId } };

    // Apply filters from query
    if (query) {
      if (query.fromDate && query.toDate) {
        where.orderDate = Between(
          new Date(query.fromDate),
          new Date(query.toDate),
        );
      } else if (query.fromDate) {
        where.orderDate = MoreThanOrEqual(new Date(query.fromDate));
      } else if (query.toDate) {
        where.orderDate = LessThanOrEqual(new Date(query.toDate));
      }

      if (query.status) {
        where.status = query.status;
      }
    }

    const orders = await this.orderRepository.find({
      where,
      relations: ['items', 'items.ticket', 'items.ticket.event', 'customer'],
      order: { orderDate: 'DESC' },
    });

    return orders.map((order) => this.mapToOrderResponseDto(order));
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
