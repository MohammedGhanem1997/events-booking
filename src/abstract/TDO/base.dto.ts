import { IsString, IsNumber, IsOptional } from 'class-validator';

export class BaseListingDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  sort?: string;

  @IsOptional()
  limit?: number | string;

  @IsOptional()
  page?: number | string;
}
