import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Permissions } from 'src/decorators/permission.decorator';
import { Action, Resource } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Request } from 'express';


@Controller('users')
@UseGuards(AuthGuard, AuthorizationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService, 
    private readonly prismaService: PrismaService) {}

  @Permissions([ {resource: Resource.USERS, actions: [Action.READ, Action.CREATE]} ])  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Permissions([ {resource: Resource.USERS, actions: [Action.READ]} ])
  @Get()
  findAll(@Req() req: Request) {
    /* console.log("USER IN REQ");
    console.log(req['user']); */
    return this.usersService.findAll();
  }

  @Permissions([ {resource: Resource.USERS, actions: [Action.SHOW]} ])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Permissions([ {resource: Resource.USERS, actions: [Action.UPDATE]} ])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Permissions([ {resource: Resource.USERS, actions: [Action.DELETE]} ])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

}
