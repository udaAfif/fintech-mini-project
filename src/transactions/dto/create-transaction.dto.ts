import { IsNumber, IsString, IsOptional, IsIn } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTransactionDto {
  @ApiProperty({
    example: "68d60c75be72e1c6b11e1d2e",
    description: "ID customer terkait transaksi",
  })
  @IsString()
  customerId: string;

  @ApiProperty({
    example: 50000,
    description: "Jumlah transaksi",
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: "debit",
    description: "Jenis transaksi (debit / credit)",
    enum: ["debit", "credit"],
  })
  @IsString()
  @IsIn(["debit", "credit"])
  type: "debit" | "credit";

  @ApiPropertyOptional({
    example: "debit-001",
    description: "Idempotency key untuk mencegah duplikasi",
  })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @ApiPropertyOptional({
    example: { orderId: "12345", note: "Pembayaran cicilan" },
    description: "Metadata tambahan transaksi",
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
