export interface NotificationItem {
  _id: string;
  user: string;
  title: string;
  body?: string;
  isRead: boolean;
  linkRef?: 'project' | 'ticket' | 'chat' | 'transaction' | 'user' | string;
  linkId?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
