import { Global, Module } from '@nestjs/common';
import { LanguageService } from './language.serviceprovider';
import { LanguageInterceptor } from './language.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  providers: [
    // Global Language Service
    {
      provide: APP_INTERCEPTOR,
      useClass: LanguageInterceptor, // Auto-set language in every request
    },
    {
      provide: 'LANGUAGE_SERVICE', // Use a custom token
      useClass: LanguageService,
    },
  ],
  exports: ['LANGUAGE_SERVICE'],
})
export class LanguageModule {}
