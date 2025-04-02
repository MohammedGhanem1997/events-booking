import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';

export class LoginDto {
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
}
