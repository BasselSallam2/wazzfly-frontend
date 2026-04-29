import type { MilestoneStatus, ProjectStatus } from '@/config/constants';
import type { User } from './user';

export interface Milestone {
  _id?: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  status: MilestoneStatus;
  deliverable?: string;
  rejectionReason?: string;
  deliveredAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  Budget: number;
  deposite?: number;
  paid?: number;
  refunded?: number;
  deadline?: string;
  projectType?: 'fixed' | 'hourly' | 'milestone';
  status: ProjectStatus;
  client: string | User;
  freelancer?: string | User | null;
  milestones?: Milestone[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListFilters {
  status?: ProjectStatus;
  client?: string;
  freelancer?: string;
}
