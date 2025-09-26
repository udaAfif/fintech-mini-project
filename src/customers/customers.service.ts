import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private model: Model<CustomerDocument>) {}

  async create(dto: CreateCustomerDto) {
    const doc = new this.model(dto);
    return doc.save();
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }
}
