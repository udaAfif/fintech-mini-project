import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotFoundException } from "@nestjs/common";
import { Transaction } from "./schemas/transaction.schema";
import {
  Customer,
  CustomerDocument,
} from "../customers/schemas/customer.schema";
import { PaymentsService } from "../payments/payments.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private txModel: Model<Transaction>,
    @InjectModel(Customer.name) private userModel: Model<CustomerDocument>,
    private readonly paymentsService: PaymentsService,
    private readonly notificationsService: NotificationsService
  ) {}

  async createTransaction(dto: {
    customerId: string;
    type: "credit" | "debit";
    amount: number;
    cardInfo?: any;
    idempotencyKey?: string;
  }) {
    const { customerId, type, amount, cardInfo, idempotencyKey } = dto;

    const user = await this.userModel.findById(customerId);
    if (!user) throw new BadRequestException("User not found");

    const createdTx = new this.txModel({
      customerId,
      type,
      amount,
      status: "processing",
    });
    await createdTx.save();

    try {
      if (type === "credit") {
        await this.paymentsService.chargeExternal(
          amount,
          cardInfo,
          idempotencyKey
        );
        user.balance += amount;
        await user.save();
      } else if (type === "debit") {
        if (user.balance < amount) {
          throw new BadRequestException("Insufficient balance");
        }
        await this.paymentsService.chargeExternal(
          amount,
          cardInfo,
          idempotencyKey
        );
        user.balance -= amount;
        await user.save();
      }

      createdTx.status = "succeeded";
      await createdTx.save();

      await this.notificationsService.sendNotification(customerId, createdTx);
      return createdTx;
    } catch (err) {
      createdTx.status = "failed";
      await createdTx.save();
      throw err;
    }
  }

  async findAll() {
    return this.txModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    const tx = await this.txModel.findById(id).exec();
    if (!tx) throw new NotFoundException("Transaction not found");
    return tx;
  }
}
