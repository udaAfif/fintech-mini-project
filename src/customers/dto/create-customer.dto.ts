// import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";

// export class CreateCustomerDto {
//   @IsEmail()
//   email: string;

//   @IsString()
//   name: string;

//   @IsOptional()
//   @IsNumber()
//   balance?: number;
// }

// src/customers/dto/create-customer.dto.ts
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
    example: "akbar@example.com",
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
