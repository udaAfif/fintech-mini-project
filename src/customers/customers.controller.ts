import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly svc: CustomersService) {}

  @Post()
  async create(@Body() dto: CreateCustomerDto) {
    return this.svc.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.findById(id);
  }
}
