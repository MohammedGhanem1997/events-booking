import { IsInt, Min, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class OrderItemDto {
  @IsInt()
  @Min(1, { message: 'Ticket ID must be a positive integer' })
  ticketId: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsNotEmpty()
  @MinLength(3)
  ticketType: string; // e.g., "General", "VIP"

  @IsNumber()
  @Min(0)
  price: number; // Price at time of order
}
