import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserIdentityService } from './user-identity.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

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

  @Post('staffs')
  createStaff(@Body() createCustomerDto: CreateCustomerDto) {
    return this.userIdentityService.createCustomer(createCustomerDto);
  }

  @Get('staffs/all')
  findAll() {
    return this.userIdentityService.findAllStaffs;
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
