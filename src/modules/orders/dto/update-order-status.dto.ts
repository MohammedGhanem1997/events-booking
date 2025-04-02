import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['processing', 'confirmed', 'cancelled', 'completed'], {
    message: 'Invalid order status',
  })
  status: 'processing' | 'confirmed' | 'cancelled' | 'completed';

  cancellationReason?: string;
}
