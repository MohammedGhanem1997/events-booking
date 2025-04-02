import { IsOptional, IsDateString, IsIn } from 'class-validator';
import { BaseListingDto } from 'src/abstract/TDO/base.dto';

export class OrderQueryDto extends BaseListingDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status?: string;

  @IsOptional()
  customerEmail?: string;

  @IsOptional()
  eventId?: number;
}
