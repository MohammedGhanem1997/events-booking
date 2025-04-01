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

  async createStaff(data: Partial<Staff>) {
    const staff = this.staffRepo.create(data);
    return this.staffRepo.save(staff);
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

  async updateStaff(id: number, data: Partial<Staff>) {
    await this.staffRepo.update(id, data);
    return this.staffRepo.findOne({ where: { id }, relations: ['role'] });
  }

  async findAllStaffs() {
    let qr = this.customerRepo
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.role', 'role')
      .select(['staff', 'role']);

    return this._paginate<StaffResponseDto>(qr, {
      page: 1,
      limit: 10,
    });
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
