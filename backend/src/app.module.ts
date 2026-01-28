import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, UsersModule, CustomersModule, TasksModule],
  providers: [PrismaService],
})
export class AppModule {}
