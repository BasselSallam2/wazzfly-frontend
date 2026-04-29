import type { User } from './user';

export interface Activity {
  _id: string;
  title?: string;
  action: string;
  /** Who performed the action (backend: refPath `actor` on Activity). */
  actor?: string | User;
  /** Legacy / alternate naming in some UIs */
  user?: string | User;
  entity?: string;
  entityId?: string;
  targetRef?: string;
  meta?: Record<string, unknown>;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}
