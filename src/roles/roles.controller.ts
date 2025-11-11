import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './role.dto';
import { Role } from '@prisma/client';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() role: RoleDto): Promise<Role> {
    return await this.rolesService.create(role);
  }
}
