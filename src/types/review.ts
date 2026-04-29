import type { User } from './user';
import type { Project } from './project';

export interface Review {
  _id: string;
  user: string | User;
  reviewer: string | User;
  project?: string | Project | null;
  stars: number;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
