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
  UseGuards,
} from '@nestjs/common';
import { UserIdentityService } from './user-identity.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller()
export class UserIdentityController {
  constructor(private readonly userIdentityService: UserIdentityService) {}

  @Post('register')
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
  @UseGuards(JwtAuthGuard)
  @Get('customers/all')
  findAllCustomers(@Query() query) {
    return this.userIdentityService.findAllCustomers(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customers/:id')
  findOneCustomer(@Param('id') id: string) {
    return this.userIdentityService.findOneCustomer(+id);
  }
  // @Delete('customers/:id')
  // deleteCustomer(@Param('id') id: string) {
  //   return this.userIdentityService.deleteCustomer(+id);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('staffs')
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    Logger.warn(createStaffDto);
    return this.userIdentityService.createStaff(createStaffDto);
  }
  @UseGuards(JwtAuthGuard)
  @Put('staffs/:id')
  updateStaff(@Body() updateStaffDto: UpdateStaffDto, @Param('id') id: string) {
    Logger.warn(updateStaffDto);
    return this.userIdentityService.updateStaff(+id, updateStaffDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('staffs/all')
  findAll(@Query() query) {
    return this.userIdentityService.findAllStaffs(query);
  }
  @UseGuards(JwtAuthGuard)
  @Get('staffs/:id')
  findOne(@Param('id') id: string) {
    return this.userIdentityService.findOneStaff(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('staffs/:id')
  deleteStaff(@Param('id') id: string) {
    return this.userIdentityService.deleteStaff(+id);
  }
}
