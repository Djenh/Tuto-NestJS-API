import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Action } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { PERMISSIONS_KEY } from 'src/decorators/permission.decorator';
import { Permission } from 'src/roles/role.dto';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private reflector: Reflector, 
    private authService: AuthService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException("Utilisateur non trouvé");
    }

    const routePermissions: Permission[] = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(`Les permission de cette route sont ${routePermissions}`);
    routePermissions.forEach((item)=>console.log(item));

    if (!routePermissions) {
        return true;
    }
    // console.log(request.user);

    try {
      const userPermissions = await this.authService.getUserPermissions(request.user.sub);

      for (const routePermission of routePermissions) {
        const userPermission = userPermissions.find(
          (perm) => perm.resource === routePermission.resource,
        );

        // console.log(userPermission);

        if (!userPermission) throw new ForbiddenException("Vous n'avez pas accès à cette action");

        const userActions = userPermission.actions as string[];
        // console.log(userActions);
        

        const allActionsAvailable = routePermission.actions.every(
          (requiredAction) => userActions.includes(requiredAction),
        );

        if (!allActionsAvailable) throw new ForbiddenException("Vous n'avez pas accès à cette action");
        
      }
    } catch (e) {
        console.log(e);
        throw new ForbiddenException("Vous n'avez pas accès à cette action");
    }
    return true;
  }

    isActionArray(value: unknown): value is Action[] {
        return (
            Array.isArray(value) &&
            value.every(item => Object.values(Action).includes(item))
        );
    }
}