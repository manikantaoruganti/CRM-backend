import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create task (ADMIN only)' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks (ADMIN: all tasks, EMPLOYEE: own tasks)' })
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Request() req,
  ) {
    return this.tasksService.updateStatus(
      id,
      req.user.userId,
      req.user.role,
      updateTaskStatusDto,
    );
  }
}
