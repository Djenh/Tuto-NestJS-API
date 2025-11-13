import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';
import { MyLoggerModule } from 'src/logger/my-logger.module';

@Module({
  imports: [PrismaModule, AuthModule, RolesModule, MyLoggerModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, PrismaService],
})
export class UsersModule {}
