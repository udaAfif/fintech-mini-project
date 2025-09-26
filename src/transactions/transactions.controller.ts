import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly svc: TransactionsService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.svc.createTransaction(dto);
  }

  @Get()
  async list() {
    return this.svc.findAll();
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.svc.findById(id);
  }
}
