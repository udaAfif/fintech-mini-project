import {
  IsEmail,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCustomerDto {
  @ApiProperty({
    example: "Afif",
    description: "Nama lengkap customer",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: "afif@mail.com",
    description: "Email customer",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: 100000,
    description: "Saldo awal customer",
  })
  @IsOptional()
  @IsNumber()
  balance?: number;
}
