import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto } from './role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
    constructor(private readonly prismaService: PrismaService){}

    async create(roleDto: RoleDto): Promise<Role> {
        return await this.prismaService.role.create({
            data: {
                name: roleDto.name, 
                permissions: {
                    create: roleDto.permissions
                }
            }
        });
    }

    async getRoleById(roleId: number) {
        return await this.prismaService.role.findUnique({
            where: {id: roleId},
            include: { permissions: true}
        });
    }
}
