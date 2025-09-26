// import { Body, Controller, Get, Param, Post } from "@nestjs/common";
// import { TransactionsService } from "./transactions.service";
// import { CreateTransactionDto } from "./dto/create-transaction.dto";

// @Controller("transactions")
// export class TransactionsController {
//   constructor(private readonly svc: TransactionsService) {}

//   @Post()
//   async create(@Body() dto: CreateTransactionDto) {
//     return this.svc.createTransaction(dto);
//   }

//   @Get()
//   async list() {
//     return this.svc.findAll();
//   }

//   @Get(":id")
//   async get(@Param("id") id: string) {
//     return this.svc.findById(id);
//   }
// }

// src/transactions/transactions.controller.ts
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { ApiTags, ApiResponse } from "@nestjs/swagger";

@ApiTags("Transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly svc: TransactionsService) {}

  @Post()
  @ApiResponse({ status: 201, description: "Transaksi berhasil dibuat" })
  async create(@Body() dto: CreateTransactionDto) {
    return this.svc.createTransaction(dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: "List semua transaksi" })
  async list() {
    return this.svc.findAll();
  }

  @Get(":id")
  @ApiResponse({ status: 200, description: "Detail transaksi berdasarkan ID" })
  async get(@Param("id") id: string) {
    return this.svc.findById(id);
  }
}
