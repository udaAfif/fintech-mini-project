import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Types, Schema as MongooseSchema } from "mongoose";

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Customer",
    required: true,
  })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: ["debit", "credit"], required: true })
  type: string;

  @Prop({ enum: ["processing", "succeeded", "failed"], default: "processing" })
  status: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  metadata: Record<string, any>;

  @Prop()
  idempotencyKey?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
