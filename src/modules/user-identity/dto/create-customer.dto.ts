import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { BaseEntityWithIdDto } from 'src/abstract/TDO/base-entity-with-id.dto';
import { Match } from '../decorator/match.decorator';

export class CreateCustomerDto extends PartialType(BaseEntityWithIdDto) {
  @IsString({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.invalidType', {
        args: { field: i18n.t('user.fields.email'), type: 'string' },
      });
    },
  })
  @IsNotEmpty({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.required', {
        args: { field: i18n.t('user.fields.email') },
      });
    },
  })
  @IsEmail(
    {},
    {
      message: () => {
        const i18n = I18nContext.current();
        return i18n.t('user.validation.invalidEmail', {
          args: { field: i18n.t('user.fields.email') },
        });
      },
    },
  )
  email: string;
  @IsString({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.invalidType', {
        args: { field: i18n.t('user.fields.firstName'), type: 'string' },
      });
    },
  })
  @IsNotEmpty({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.required', {
        args: { field: i18n.t('user.fields.firstName') },
      });
    },
  })
  firstName: string;
  @IsString({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.invalidType', {
        args: { field: i18n.t('user.fields.lastName'), type: 'string' },
      });
    },
  })
  @IsNotEmpty({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.required', {
        args: { field: i18n.t('user.fields.lastName') },
      });
    },
  })
  lastName: string;
  @IsString({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.invalidType', {
        args: { field: i18n.t('user.fields.phoneNumber'), type: 'string' },
      });
    },
  })
  @IsNotEmpty({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.required', {
        args: { field: i18n.t('user.fields.phoneNumber') },
      });
    },
  })
  phoneNumber: string;
  @IsString({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.invalidType', {
        args: { field: i18n.t('user.fields.password'), type: 'string' },
      });
    },
  })
  @IsString({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.invalidType', {
        args: { field: i18n.t('user.fields.password'), type: 'string' },
      });
    },
  })
  @IsNotEmpty({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.required', {
        args: { field: i18n.t('user.fields.password') },
      });
    },
  })
  password: string;
  @IsString({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.invalidType', {
        args: { field: i18n.t('user.fields.password'), type: 'string' },
      });
    },
  })
  @IsNotEmpty({
    message: () => {
      const i18n = I18nContext.current();
      return i18n.t('user.validation.invalidType', {
        args: { field: i18n.t('user.fields.confirmPassword'), type: 'string' },
      });
    },
  })
  @Match('password')
  confirmPassword: string;
}
