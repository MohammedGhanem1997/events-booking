import { IsString, IsOptional, MaxLength } from 'class-validator';
import { BaseEntityWithIdDto } from './base-entity-with-id.dto';

export class BaseEntityWithMetaDto extends BaseEntityWithIdDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  createdBy?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  updatedBy?: string;
}
