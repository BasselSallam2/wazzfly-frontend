import type { User } from './user';

export interface ChatMessage {
  _id?: string;
  sender: string | User;
  text: string;
  attachments?: string[];
  isRead?: boolean;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: Array<string | User>;
  lastMessage?: ChatMessage | null;
  messages?: ChatMessage[];
  isBlocked?: boolean;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}
