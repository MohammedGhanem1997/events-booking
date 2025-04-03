import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateTicketDto } from 'src/modules/tickets/dto/update-ticket.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => UpdateTicketDto)
  @IsOptional()
  tickets: UpdateTicketDto[];
}
