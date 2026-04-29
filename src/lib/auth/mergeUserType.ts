import type { User } from '@/types';
import { USER_ROLES, type UserRole } from '@/config/constants';
import { decodeJwtPayload } from './jwtPayload';

const ROLES: UserRole[] = [USER_ROLES.admin, USER_ROLES.client, USER_ROLES.freelancer];

function isUserRole(x: unknown): x is UserRole {
  return typeof x === 'string' && (ROLES as string[]).includes(x);
}

/**
 * Merges `type` from the JWT when the API user object omits it (e.g. Admin collection documents).
 */
export function mergeUserTypeFromToken(user: object, token: string | null): User {
  const u = user as Record<string, unknown>;
  if (u.type && isUserRole(u.type)) {
    return user as User;
  }
  const payload = decodeJwtPayload<{ type?: string }>(token);
  if (payload?.type && isUserRole(payload.type)) {
    return { ...u, type: payload.type } as User;
  }
  return user as User;
}
