import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const existingEmail = await this.prisma.customer.findUnique({
      where: { email: createCustomerDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingPhone = await this.prisma.customer.findUnique({
      where: { phone: createCustomerDto.phone },
    });

    if (existingPhone) {
      throw new ConflictException('Phone already exists');
    }

    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, totalRecords] = await Promise.all([
      this.prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count(),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      page,
      limit,
      totalRecords,
      totalPages,
      data,
    };
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingEmail = await this.prisma.customer.findUnique({
        where: { email: updateCustomerDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateCustomerDto.phone && updateCustomerDto.phone !== customer.phone) {
      const existingPhone = await this.prisma.customer.findUnique({
        where: { phone: updateCustomerDto.phone },
      });

      if (existingPhone) {
        throw new ConflictException('Phone already exists');
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.prisma.customer.delete({
      where: { id },
    });

    return { message: 'Customer deleted successfully' };
  }
}
