// import { Body, Controller, Get, Param, Post } from "@nestjs/common";
// import { CustomersService } from "./customers.service";
// import { CreateCustomerDto } from "./dto/create-customer.dto";

// @Controller("customers")
// export class CustomersController {
//   constructor(private readonly svc: CustomersService) {}

//   @Post()
//   async create(@Body() dto: CreateCustomerDto) {
//     return this.svc.create(dto);
//   }

//   @Get(":id")
//   async get(@Param("id") id: string) {
//     return this.svc.findById(id);
//   }
// }

// src/customers/customers.controller.ts
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { ApiTags, ApiResponse } from "@nestjs/swagger";

@ApiTags("Customers")
@Controller("customers")
export class CustomersController {
  constructor(private readonly svc: CustomersService) {}

  @Post()
  @ApiResponse({ status: 201, description: "Customer berhasil dibuat" })
  async create(@Body() dto: CreateCustomerDto) {
    return this.svc.create(dto);
  }

  @Get(":id")
  @ApiResponse({ status: 200, description: "Detail customer berdasarkan ID" })
  async get(@Param("id") id: string) {
    return this.svc.findById(id);
  }
}
