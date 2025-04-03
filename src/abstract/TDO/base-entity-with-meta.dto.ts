import { IsString, IsOptional, MaxLength } from 'class-validator';
import { BaseEntityWithIdDto } from './base-entity-with-id.dto';

export class BaseEntityWithMetaDto extends BaseEntityWithIdDto {
  @IsOptional()
  createdBy?: string;

  @IsOptional()
  updatedBy?: string;
}
