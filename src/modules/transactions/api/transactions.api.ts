import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { ApiEnvelope, ListQuery, Paginated, Transaction } from '@/types';

export interface TransactionFilters {
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  'createdAt[gte]'?: string;
  'createdAt[lte]'?: string;
  'amount[gte]'?: number;
  'amount[lte]'?: number;
  'meta.project'?: string;
  'meta.ticket'?: string;
}

export const transactionsApi = {
  list: async (
    query?: ListQuery<TransactionFilters>,
  ): Promise<Paginated<Transaction>> => {
    const res = await api.get<Paginated<Transaction>>(E.transaction.base, {
      params: buildQuery(query),
    });
    return res.data;
  },
  get: async (id: string): Promise<Transaction> => {
    const res = await api.get<ApiEnvelope<Transaction>>(E.transaction.byId(id));
    return res.data.data;
  },
};
