import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { Transaction, TransactionSchema } from "./schemas/transaction.schema";
import { Customer, CustomerSchema } from "../customers/schemas/customer.schema";
import { PaymentsModule } from "../payments/payments.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PaymentsService } from "../payments/payments.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    PaymentsModule,
    NotificationsModule,
  ],
  providers: [TransactionsService, PaymentsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
