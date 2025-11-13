import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MyLoggerService } from 'src/logger/my-logger.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: MyLoggerService
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const passwordHash =  await bcrypt.hash(createUserDto.password, 10);

    const user = this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: passwordHash,
          phone: createUserDto.phone,
        }
      });

    return user;
  }

  async findAll(): Promise<User[]> {
    this.logger.log("Liste des utilisateurs", UsersService.name);
    return this.prismaService.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    this.logger.log("Show utilisateur", UsersService.name);
    return this.prismaService.user.findUnique({
      where: {id: id},
      include: { services: true, pictures: true}
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
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
