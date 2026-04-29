import type { TicketStatus, TicketType } from '@/config/constants';
import type { User } from './user';
import type { Project } from './project';

export interface TicketMessage {
  _id?: string;
  sender: string | User;
  /** `admin` = support staff, `user` = ticket requester (see backend `tickets` schema). */
  senderRole?: 'user' | 'admin';
  text: string;
  attachments?: string[];
  createdAt: string;
}

export interface Ticket {
  _id: string;
  type: TicketType;
  title: string;
  description: string;
  status: TicketStatus;
  user: string | User;
  project?: string | Project | null;
  attachments?: string[];
  messages?: TicketMessage[];
  action?: string;
  closedBy?: string | User;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}
