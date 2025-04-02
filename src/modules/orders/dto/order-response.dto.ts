class OrderItemResponseDto {
  id: number;

  ticketId: number;

  ticketType: string;

  eventName: string;

  quantity: number;

  price: number;

  subtotal: number;
}

export class OrderResponseDto {
  id: number;

  orderNumber: string;

  customerEmail: string;

  customerName: string;

  items: OrderItemResponseDto[];

  totalAmount: number;

  orderDate: Date;

  status: string;

  promoCode?: string;

  paymentStatus: string;

  constructor(partial: Partial<OrderItemResponseDto>) {
    Object.assign(this, partial);
  }
}
