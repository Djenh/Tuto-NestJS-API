import { Injectable } from '@nestjs/common';
/* import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; */
import { Prisma, User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService){}

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data: createUserDto
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {id: id},
      include: { services: true, pictures: true}
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({
      where: {id: id}, 
      data: updateUserDto
    });
  }

  async remove(id: number): Promise<User> {
    return this.prismaService.user.delete({
      where: {id: id}
    });
  }
}
