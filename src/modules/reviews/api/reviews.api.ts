import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { ListQuery, Paginated, Review } from '@/types';

export const reviewsApi = {
  list: async (query?: ListQuery): Promise<Paginated<Review>> => {
    const res = await api.get<Paginated<Review>>(E.reviews.base, { params: buildQuery(query) });
    return res.data;
  },
};
