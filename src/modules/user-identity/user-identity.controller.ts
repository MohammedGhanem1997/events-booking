import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Logger,
} from '@nestjs/common';
import { UserIdentityService } from './user-identity.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateStaffDto } from './dto/create-staff.dto';

@Controller('user-identity')
export class UserIdentityController {
  constructor(private readonly userIdentityService: UserIdentityService) {}

  @Post('customers')
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.userIdentityService.createCustomer(createCustomerDto);
  }

  @Put('customers/:id')
  updateCustomer(
    @Param('id') id: string,
    @Body() updateeCustomerDto: UpdateCustomerDto,
  ) {
    return this.userIdentityService.updateCustomer(+id, updateeCustomerDto);
  }

  @Get('customers/all')
  findAllCustomers(@Query() query) {
    return this.userIdentityService.findAllCustomers(query);
  }

  @Get('customers/:id')
  findOneCustomer(@Param('id') id: string) {
    return this.userIdentityService.findOneCustomer(+id);
  }
  // @Delete('customers/:id')
  // deleteCustomer(@Param('id') id: string) {
  //   return this.userIdentityService.deleteCustomer(+id);
  // }

  @Post('staffs')
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    Logger.warn(createStaffDto);
    return this.userIdentityService.createStaff(createStaffDto);
  }

  @Get('staffs/all')
  findAll(@Query() query) {
    return this.userIdentityService.findAllStaffs(query);
  }

  @Get('staffs/:id')
  findOne(@Param('id') id: string) {
    return this.userIdentityService.findOneStaff(+id);
  }

  @Delete('staffs/:id')
  deleteStaff(@Param('id') id: string) {
    return this.userIdentityService.deleteStaff(+id);
  }
}
