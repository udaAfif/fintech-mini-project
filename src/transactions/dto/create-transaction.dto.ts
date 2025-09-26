import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  customerId: string;

  @IsNumber()
  amount: number;

  @IsString()
  type: 'debit' | 'credit';

  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
