import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const assignee = await this.prisma.user.findUnique({
      where: { id: createTaskDto.assignedTo },
    });

    if (!assignee) {
      throw new NotFoundException('Assigned user not found');
    }

    if (assignee.role !== Role.EMPLOYEE) {
      throw new BadRequestException('Tasks can only be assigned to EMPLOYEE users');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: createTaskDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.task.create({
      data: createTaskDto,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        customer: true,
      },
    });
  }

  async findAll(userId: number, role: Role) {
    if (role === Role.ADMIN) {
      return this.prisma.task.findMany({
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          customer: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.task.findMany({
      where: { assignedTo: userId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, role: Role) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        customer: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (role === Role.EMPLOYEE && task.assignedTo !== userId) {
      throw new ForbiddenException('You can only view your own tasks');
    }

    return task;
  }

  async updateStatus(
    id: number,
    userId: number,
    role: Role,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (role === Role.EMPLOYEE && task.assignedTo !== userId) {
      throw new ForbiddenException('You can only update status of your own tasks');
    }

    return this.prisma.task.update({
      where: { id },
      data: { status: updateTaskStatusDto.status },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        customer: true,
      },
    });
  }
}
