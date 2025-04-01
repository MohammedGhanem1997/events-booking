import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/abstract';
import { plainToInstance } from 'class-transformer';
import { CustomerResponseDto } from './dto/response-customer.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Staff } from './entities/staff.entity';
import { RESPONSE_MESSAGES } from 'src/types/responseMessages';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffResponseDto } from './dto/response-staff.dto';

@Injectable()
export class UserIdentityService extends BaseService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Staff) private staffRepo: Repository<Staff>,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {
    super();
  }
  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    try {
      const createCustomer = this.customerRepo.create(createCustomerDto);
      const customer = await this.customerRepo.save(createCustomer);
      return plainToInstance(CustomerResponseDto, customer);
    } catch (error) {
      Logger.error(error);
      this.customErrorHandle(error);
    }
  }

  async updateCustomer(
    id: number,
    data: Partial<Customer>,
  ): Promise<CustomerResponseDto> {
    try {
      const customer = await this.customerRepo.findOne({ where: { id } });
      if (!customer) {
        this._getBadRequestError(this.i18n.t('user.errors.userNotFound'));
      }

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      let updateCustomer = await this.customerRepo.preload({
        id: id,
        ...data,
      });
      let newCustomer = await this.customerRepo.save(updateCustomer);
      return plainToInstance(CustomerResponseDto, newCustomer);
    } catch (error) {
      Logger.error(error);
      this.customErrorHandle(error);
    }
  }
  async findOneCustomer(id: number) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      this._getBadRequestError(this.i18n.t('user.errors.userNotFound'));
    }
    return customer;
  }

  async findCustomerByEmail(email: string) {
    const customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer) {
      this._getBadRequestError(this.i18n.t('user.errors.userNotFound'));
    }
    return customer;
  }
  async findAllCustomers(query) {
    const allowedFieldsToSort = [
      'firstName',
      'id',
      'phoneNumber',
      'createdAt',
      'lastName',
    ];
    let { page = 1, limit = 10, sort = '-createdAt' } = query;
    let qr = this.customerRepo
      .createQueryBuilder('customer')
      .select(['customer']);
    if (query.search) {
      qr.andWhere(
        'customer.firstName  or customer.email or customer.phoneNumber or customer.firstName LIKE :search',
        {
          search: `%${query.search}%`,
        },
      );
    }
    if (query.email) {
      qr.andWhere('customer.email LIKE :email', {
        email: `%${query.email}%`,
      });
    }
    if (query.phoneNumber) {
      qr.andWhere('customer.phoneNumber   LIKE :phoneNumber', {
        phoneNumber: `%${query.phoneNumber}%`,
      });
    }
    if (query.firstName) {
      qr.andWhere('customer.firstName LIKE :firstName', {
        firstName: `%${query.firstName}%`,
      });
    }
    if (query.lastName) {
      qr.andWhere('customer.lastName LIKE :lastName', {
        lastName: `%${query.lastName}%`,
      });
    }
    if (query.start_date && query.end_date) {
      qr.andWhere('customer.createdAt BETWEEN :start_date AND :end_date', {
        start_date: query.start_date,
        end_date: query.end_date,
      });
    } else if (query.start_date) {
      qr.andWhere('customer.createdAt >= :start_date', {
        start_date: query.start_date,
      });
    }
    if (query.end_date) {
      qr.andWhere('customer.createdAt <= :end_date', {
        end_date: query.end_date,
      });
    }
    if (sort) {
      const param = this.buildSortParams<{
        firstName: string;
        id: number;
        phoneNumber: number;
        createdAt: Date;
        lastName: string;
      }>(sort); //check if param is one of keys
      if (allowedFieldsToSort.includes(param[0])) {
        if (param[0] === 'phoneNumber') {
          qr.orderBy(`customer.${param[0]}`, param[1]);
        }
        if (param[0] === 'id') {
          qr.orderBy(`customer.${param[0]}`, param[1]);
        }
        if (param[0] === 'createdAt') {
          qr.orderBy(`customer.${param[0]}`, param[1]);
        }
        if (param[0] === 'lastName') {
          qr.orderBy(`customer.${param[0]}`, param[1]);
        }
        if (param[0] === 'firstName') {
          qr.orderBy(`customer.${param[0]}`, param[1]);
        }
      }
    }

    let result = await this._paginate<CustomerResponseDto>(qr, {
      page: page,
      limit: limit,
    });
    return {
      ...result,
      items: plainToInstance(CustomerResponseDto, result.items),
    };
  }

  async createStaff(createStaffDto: Partial<Staff>) {
    try {
      const createStaff = this.staffRepo.create(createStaffDto);
      const staff = await this.staffRepo.save(createStaff);
      return plainToInstance(StaffResponseDto, staff);
    } catch (error) {
      this.customErrorHandle(error);
    }
  }

  async findOneStaff(id: number) {
    let qr = this.staffRepo
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .select(['staff', 'role', 'permissions.id', 'permissions.name'])
      .where('staff.id = :id', { id });
    const staff = await qr.getOne();
    return staff;
  }
  async findeStaffByEmail(email: string) {
    let qr = this.staffRepo
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .select(['staff', 'role', 'permissions'])
      .where('staff.email = :email', { email });
    const staff = await qr.getOne();
    return staff;
  }
  async updateStaff(id: number, data: Partial<Staff>) {
    await this.staffRepo.update(id, data);
    return this.staffRepo.findOne({ where: { id }, relations: ['role'] });
  }

  async findAllStaffs(query) {
    const allowedFieldsToSort = [
      'firstName',
      'id',
      'phoneNumber',
      'createdAt',
      'lastName',
    ];
    let { page = 1, limit = 10, sort = '-createdAt' } = query;
    let qr = this.staffRepo
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.role', 'role')
      .select(['staff', 'role']);
    if (query.search) {
      qr.andWhere(
        'staff.firstName  or staff.email or staff.phoneNumber or staff.lastName LIKE :search',
        {
          search: `%${query.search}%`,
        },
      );
    }
    if (query.email) {
      qr.andWhere('staff.email LIKE :email', {
        email: `%${query.email}%`,
      });
    }
    if (query.phoneNumber) {
      qr.andWhere('staff.phoneNumber   LIKE :phoneNumber', {
        phoneNumber: `%${query.phoneNumber}%`,
      });
    }
    if (query.firstName) {
      qr.andWhere('staff.firstName LIKE :firstName', {
        firstName: `%${query.firstName}%`,
      });
    }
    if (query.lastName) {
      qr.andWhere('staff.lastName LIKE :lastName', {
        lastName: `%${query.lastName}%`,
      });
    }
    if (query.role) {
      qr.andWhere('role.name Like :role', {
        role: `%${query.role}%`,
      });
    }
    if (query.start_date && query.end_date) {
      qr.andWhere('staff.createdAt BETWEEN :start_date AND :end_date', {
        start_date: query.start_date,
        end_date: query.end_date,
      });
    } else if (query.start_date) {
      qr.andWhere('staff.createdAt >= :start_date', {
        start_date: query.start_date,
      });
    }
    if (query.end_date) {
      qr.andWhere('staff.createdAt <= :end_date', {
        end_date: query.end_date,
      });
    }
    if (sort) {
      const param = this.buildSortParams<{
        firstName: string;
        id: number;
        phoneNumber: number;
        createdAt: Date;
        lastName: string;
      }>(sort); //check if param is one of keys
      if (allowedFieldsToSort.includes(param[0])) {
        if (param[0] === 'phoneNumber') {
          qr.orderBy(`staff.${param[0]}`, param[1]);
        }
        if (param[0] === 'id') {
          qr.orderBy(`staff.${param[0]}`, param[1]);
        }
        if (param[0] === 'createdAt') {
          qr.orderBy(`staff.${param[0]}`, param[1]);
        }
        if (param[0] === 'lastName') {
          qr.orderBy(`staff.${param[0]}`, param[1]);
        }
        if (param[0] === 'firstName') {
          qr.orderBy(`staff.${param[0]}`, param[1]);
        }
      }
    }

    let result = await this._paginate<StaffResponseDto>(qr, {
      page: page,
      limit: limit,
    });
    return {
      ...result,
      items: plainToInstance(StaffResponseDto, result.items),
    };
  }

  async deleteStaff(id: number) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) {
      this._getBadRequestError(this.i18n.t('user.errors.userNotFound'));
    }
    if (staff.role.name === 'admin') {
      this._getBadRequestError(this.i18n.t('user.errors.adminCannotBeDeleted'));
    }

    let deleted = await this.staffRepo.softDelete(id);
    if (deleted.affected === 0) {
      this._getInternalServerError(
        RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG,
      );
    }
    return {
      message: RESPONSE_MESSAGES.COMMON.DELETED_SUCCESSFULLY,
    };
  }
}
