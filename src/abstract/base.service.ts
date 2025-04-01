import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { I18nContext } from 'nestjs-i18n';

export abstract class BaseService {
  lang: string = I18nContext.current()?.lang;

  constructor() {
    this.lang = I18nContext.current()?.lang || 'ar';
  }

  protected _getBadRequestError(message: string | object) {
    if (typeof message === 'object') {
      message = message[this.lang];
    }

    throw new BadRequestException({ message });
  }
  protected _getInternalServerError(message: string | any) {
    if (typeof message === 'object') {
      message = message[this.lang];
    }
    throw new InternalServerErrorException({ message });
  }

  protected _getNotFoundError(message: string | any) {
    if (typeof message === 'object') {
      message = message[this.lang];
    }
    throw new NotFoundException({ message });
  }
  protected _getUnauthorized(message: string | any) {
    if (typeof message === 'object') {
      message = message[this.lang];
    }
    throw new UnauthorizedException({ message });
  }

  protected async _paginate<T>(
    queryBuilder: SelectQueryBuilder<any>,
    { limit = 10, page = 1 }: IPaginationOptions,
  ): Promise<Pagination<T>> {
    const totalItems = await queryBuilder.getCount();
    return await paginate<T>(queryBuilder, {
      limit,
      page,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
      metaTransformer: ({ currentPage, itemCount, itemsPerPage }) => {
        // Calculating the total of pages
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return {
          currentPage,
          itemCount,
          itemsPerPage,

          // Returning in this two row
          totalItems,
          totalPages: totalPages === 0 ? 1 : totalPages,
        };
      },
    });
  }

  public buildSortParams<T extends object>(param: string) {
    if (typeof param === 'string') {
      const result = param?.match(/^-/);
      if (result) {
        const key = param.slice(1);
        return [key, 'DESC'] as [keyof T, 'DESC'];
      }
    }
    return [param, 'ASC'] as [keyof T, 'ASC'];
  }

  protected customErrorHandle(error) {
    switch (error.name) {
      case 'HttpException':
        throw new HttpException(error.response, error?.status);
    }

    switch (
      error?.status ||
      error?.code ||
      error?.name ||
      error.driverError.code
    ) {
      case 400:
        return this._getBadRequestError(
          error.response?.message ||
            error.response.data?.message ||
            error.message,
        );
      case 404:
        return this._getNotFoundError(
          error.response?.message ||
            error.response.data?.message ||
            error.message,
        );

      case '23505':
        return this._getBadRequestError(
          RESPONSE_MESSAGES.COMMON.DUPLICATE_KEY_EXISTS,
        );
      case '23502':
        return (
          error.message ||
          this._getBadRequestError(
            RESPONSE_MESSAGES.COMMON.DUPLICATE_KEY_EXISTS,
          )
        );
      case 401:
        return this._getUnauthorized(error.message);
      case '23503':
        return this._getBadRequestError(
          RESPONSE_MESSAGES.ERROR_MESSAGES.INVALID_TYPE_OF_INPUT,
        );

      case '42830':
        return this._getBadRequestError(
          RESPONSE_MESSAGES.ERROR_MESSAGES.INVALID_REQUEST,
        );

      case '22P02':
        return this._getBadRequestError(
          RESPONSE_MESSAGES.ERROR_MESSAGES.INVALID_TYPE_OF_INPUT,
        );
      default:
        return this._getInternalServerError(
          RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG,
        );
    }
  }
}
