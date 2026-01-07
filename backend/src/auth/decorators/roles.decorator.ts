import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator - Endpoint'lere rol gereksinimi eklemek için kullanılır
 * @param roles - İzin verilen roller ('User', 'Admin', 'SuperAdmin')
 * Örnek: @Roles('Admin', 'SuperAdmin')
 */
export const Roles = (...roles: ('User' | 'Admin' | 'SuperAdmin')[]) =>
  SetMetadata(ROLES_KEY, roles);

