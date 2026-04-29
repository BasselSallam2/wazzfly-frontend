import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { ApiEnvelope, ListQuery, NotificationItem, Paginated } from '@/types';

export interface NotificationFilters {
  isRead?: boolean;
  linkRef?: string;
}

export const notificationsApi = {
  list: async (
    query?: ListQuery<NotificationFilters>,
  ): Promise<Paginated<NotificationItem>> => {
    const res = await api.get<Paginated<NotificationItem>>(E.notification.base, {
      params: buildQuery(query),
    });
    return res.data;
  },
  markRead: async (id: string): Promise<NotificationItem> => {
    const res = await api.post<ApiEnvelope<NotificationItem>>(E.notification.markRead(id));
    return res.data.data;
  },
  markAllRead: async (): Promise<void> => {
    await api.post(E.notification.markAllRead);
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(E.notification.byId(id));
  },
};
