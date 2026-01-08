import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ('User' | 'Admin' | 'SuperAdmin')[]) =>
  SetMetadata(ROLES_KEY, roles);
