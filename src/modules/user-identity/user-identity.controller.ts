import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserIdentityService } from './user-identity.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('user-identity')
export class UserIdentityController {
  constructor(private readonly userIdentityService: UserIdentityService) {}

  @Post('customers')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.userIdentityService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.userIdentityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userIdentityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateeCustomerDto: UpdateCustomerDto,
  ) {
    return this.userIdentityService.update(+id, updateeCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userIdentityService.remove(+id);
  }
}
