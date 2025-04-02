import { IsString, IsOptional } from 'class-validator';

export class SearchEventsDto {
  @IsString()
  @IsOptional()
  query: string = '';
}
