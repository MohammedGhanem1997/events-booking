import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { Type } from 'class-transformer';
import { CreatePermissionDto } from '../../permission/dto/create-permission.dto';
import { Staff } from 'src/modules/user-identity/entities/staff.entity';

export class CreateRoleDto {
  @IsString({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('role.validation.invalidType', {
        args: { field: i18n.t('role.fields.name'), type: 'string' },
      });
    },
  })
  @IsNotEmpty({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('role.validation.required', {
        args: { field: i18n.t('role.fields.name') },
      });
    },
  })
  name: string;

  @IsArray({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('role.validation.invalidType', {
        args: { field: i18n.t('role.fields.permissions'), type: 'array' },
      });
    },
  })
  @IsOptional()
  @Type(() => CreatePermissionDto)
  permissions?: CreatePermissionDto[];
}
