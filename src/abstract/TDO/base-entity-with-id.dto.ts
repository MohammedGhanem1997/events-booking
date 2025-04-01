import { IsInt, IsOptional } from 'class-validator';
import { BaseEntityDto } from './base-entity.dto';

export class BaseEntityWithIdDto extends BaseEntityDto {
  @IsInt()
  @IsOptional()
  id?: number;
}
