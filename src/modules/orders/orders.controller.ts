import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { OwnGuard } from '../auth/guards/own.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    // private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const order = await this.ordersService.createOrder(
      createOrderDto,
      req.user.id,
    );

    // Emit order created event when add rabbit and
    // await this.notificationsService.publishOrderCreated(order);

    return order;
  }

  @Patch(':id/confirm')
  async confirm(
    @Param('id') id: number,
    @Body() confirmOrderDto: ConfirmOrderDto,
    @Request() req: Request,
  ) {
    const order = await this.ordersService.confirmOrder(
      id,
      confirmOrderDto.paymentReference,
    );

    // Emit order confirmed event if needed
    // await this.notificationsService.publishOrderConfirmed(order);

    return order;
  }

  @Get()
  @UseGuards(JwtAuthGuard, OwnGuard)
  async findAllForCustomer(@Request() req) {
    return this.ordersService.findOrdersByCustomer(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OwnGuard)
  async findOne(@Param('id') id: number, @Request() req) {
    return this.ordersService.findOrderById(id, req.user.id);
  }
}
