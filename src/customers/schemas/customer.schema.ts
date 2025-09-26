import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ default: 0 })
  balance: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
