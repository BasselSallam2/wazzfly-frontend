import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { Activity, ApiEnvelope, ListQuery, Paginated, PopulateSpec } from '@/types';

/** Matches backend activity schema: `actor` ref + field list with `+` (see API / Postman). */
export const ACTIVITY_USER_POPULATE: PopulateSpec[] = [
  { path: 'actor', select: 'name+email+avatar' },
];

export const activityApi = {
  list: async (query?: ListQuery): Promise<Paginated<Activity>> => {
    const res = await api.get<Paginated<Activity>>(E.activity.base, { params: buildQuery(query) });
    return res.data;
  },
  get: async (id: string): Promise<Activity> => {
    const res = await api.get<ApiEnvelope<Activity>>(E.activity.byId(id));
    return res.data.data;
  },
};
