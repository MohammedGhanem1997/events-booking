import { BaseEntityWithIdDto } from 'src/abstract/TDO/base-entity-with-id.dto';

export class CreatePermissionDto extends BaseEntityWithIdDto {
  name: string;
  description: string;
  action: string;
  path: string;
}
