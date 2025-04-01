import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/abstract';
import { plainToInstance } from 'class-transformer';
import { CustomerResponseDto } from './dto/response-customer.dto';

@Injectable()
export class UserIdentityService extends BaseService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {
    super();
  }
  async create(
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

  findAll() {
    return `This action returns all userIdentity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userIdentity`;
  }

  update(id: number, updateUserIdentityDto: UpdateCustomerDto) {
    return `This action updates a #${id} userIdentity`;
  }

  remove(id: number) {
    return `This action removes a #${id} userIdentity`;
  }
}
