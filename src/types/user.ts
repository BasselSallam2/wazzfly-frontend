import type { UserRole } from '@/config/constants';

export type UserType = UserRole;

export interface UserBase {
  _id: string;
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
  phoneNumber?: string;
  country?: string;
  wallet?: number;
  isVerified?: boolean;
  deleted?: boolean;
  role?: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface ClientUser extends UserBase {
  type: 'client';
  organization?: {
    name?: string;
    industry?: string;
    size?: string;
    website?: string;
  };
}

export interface FreelancerUser extends UserBase {
  type: 'freelancer';
  title?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
  reviewsCount?: number;
}

export interface AdminUser extends UserBase {
  type: 'admin';
}

export type User = ClientUser | FreelancerUser | AdminUser;

export interface UserListFilters {
  type?: UserType;
  deleted?: boolean;
  isVerified?: boolean;
}
