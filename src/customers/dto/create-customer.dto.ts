import { IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
