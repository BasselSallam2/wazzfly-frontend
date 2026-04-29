import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { ApiEnvelope, Chat, ListQuery, Paginated } from '@/types';

export interface SendMessagePayload {
  text: string;
  attachments?: string[];
}

export const chatApi = {
  list: async (query?: ListQuery): Promise<Paginated<Chat>> => {
    const res = await api.get<Paginated<Chat>>(E.chat.base, { params: buildQuery(query) });
    return res.data;
  },
  get: async (id: string, query?: ListQuery): Promise<Chat> => {
    const res = await api.get<ApiEnvelope<Chat>>(E.chat.byId(id), {
      params: buildQuery(query),
    });
    return res.data.data;
  },
  create: async (withUser: string): Promise<Chat> => {
    const res = await api.post<ApiEnvelope<Chat>>(E.chat.base, { with: withUser });
    return res.data.data;
  },
  sendMessage: async (chatId: string, payload: SendMessagePayload): Promise<Chat> => {
    const res = await api.post<ApiEnvelope<Chat>>(E.chat.message(chatId), payload);
    return res.data.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(E.chat.byId(id));
  },
};
