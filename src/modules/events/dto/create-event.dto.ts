import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';
import { BaseEntityWithMetaDto } from 'src/abstract/TDO/base-entity-with-meta.dto';

export class CreateEventDto extends PartialType(BaseEntityWithMetaDto) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
