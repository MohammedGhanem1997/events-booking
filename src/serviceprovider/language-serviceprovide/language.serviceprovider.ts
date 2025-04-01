import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class LanguageService {
  lang: string = 'ar'; // Default language

//   constructor(@Inject(REQUEST) private readonly request: Request) {}

  public setLang(lang: string) {
    this.lang = lang;
    console.log('from service language', lang);
  }

  public getLang(): string {
    return this.lang;
  }
}