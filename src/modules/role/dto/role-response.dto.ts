import { Expose } from 'class-transformer';
import { PermissionResponseDto } from '../../permission/dto/permission-response.dto';

export class RoleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  permissions?: PermissionResponseDto[];
}
