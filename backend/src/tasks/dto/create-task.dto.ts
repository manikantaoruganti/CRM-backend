import { IsString, IsNotEmpty, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Follow up with customer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Call customer regarding contract renewal' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  assignedTo: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  customerId: number;
}
