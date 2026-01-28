import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'contact@acme.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Acme Corporation' })
  @IsString()
  @IsOptional()
  company?: string;
}
