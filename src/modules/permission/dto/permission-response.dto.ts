import { Expose } from 'class-transformer';
import { RoleResponseDto } from '../../role/dto/role-response.dto';

export class PermissionResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
  @Expose()
  path: string;
  @Expose()
  action: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  roles?: RoleResponseDto[];
}
