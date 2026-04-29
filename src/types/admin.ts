import type { UserBase } from './user';

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

export interface Admin extends Omit<UserBase, 'type'> {
  type: 'admin';
  role?: string | Role;
}
