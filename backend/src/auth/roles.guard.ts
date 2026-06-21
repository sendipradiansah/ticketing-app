import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // Jika rute tidak diproteksi role spesifik, loloskan
    }
    
    const { user } = context.switchToHttp().getRequest();
    // Cek apakah role user ada di dalam daftar role yang diizinkan (ADMIN/USER)
    return requiredRoles.includes(user?.role);
  }
}