import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CustomersModule } from "./customers/customers.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { PaymentsModule } from "./payments/payments.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://localhost:27017/fintech"
    ),
    CustomersModule,
    PaymentsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
