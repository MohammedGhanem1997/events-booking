import {
  Injectable,
  Inject,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

import { LanguageService } from './language.serviceprovider';

@Injectable({ scope: Scope.REQUEST })
export class LanguageInterceptor implements NestInterceptor {
  constructor(
    @Inject('LANGUAGE_SERVICE')
    private readonly languageService: LanguageService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    // Get language from the request headers or use default 'en'
    const lang = request.headers['accept-language'] || 'ar';

    // Set language in the service
    console.log('form interceptpr', lang);

    this.languageService.setLang(lang);

    return next.handle();
  }
}
