import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNotEmpty()
  customerEmail: string;

  @IsNotEmpty()
  customerPhoneNumber: string;

  @IsNotEmpty()
  customerName: string;

  // Optional fields
  promoCode?: string;
  specialRequests?: string;
}
