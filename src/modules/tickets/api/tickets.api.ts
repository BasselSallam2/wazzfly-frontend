import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { ApiEnvelope, ListQuery, Paginated, Ticket } from '@/types';

export interface TicketFilters {
  status?: 'pending' | 'closed';
  type?: 'refund' | 'scam';
  user?: string;
  project?: string;
}

export interface AddMessagePayload {
  ticketId: string;
  text: string;
  attachments?: string[];
}

export interface CloseTicketPayload {
  ticketId: string;
  action: string;
}

export const ticketsApi = {
  list: async (query?: ListQuery<TicketFilters>): Promise<Paginated<Ticket>> => {
    const res = await api.get<Paginated<Ticket>>(E.tickets.base, { params: buildQuery(query) });
    return res.data;
  },
  get: async (id: string, query?: ListQuery): Promise<Ticket> => {
    const res = await api.get<ApiEnvelope<Ticket>>(E.tickets.byId(id), {
      params: buildQuery(query),
    });
    return res.data.data;
  },
  addMessage: async (payload: AddMessagePayload): Promise<Ticket> => {
    const res = await api.post<ApiEnvelope<Ticket>>(E.tickets.addMessage, payload);
    return res.data.data;
  },
  close: async (payload: CloseTicketPayload): Promise<Ticket> => {
    const res = await api.post<ApiEnvelope<Ticket>>(E.tickets.close, payload);
    return res.data.data;
  },
};
