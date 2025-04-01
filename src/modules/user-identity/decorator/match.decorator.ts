import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { I18nContext } from 'nestjs-i18n';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const i18n = I18nContext.current();
          return i18n.t('user.validation.passwordMismatch', {
            args: {
              field: i18n.t('user.fields.confirmPassword'),
              type: 'string',
            },
          });
        },
      },
    });
  };
}
