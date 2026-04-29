import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { ApiEnvelope, ListQuery, Paginated, Project } from '@/types';

export interface ProjectFilters {
  status?: string;
  client?: string;
  freelancer?: string;
}

export const projectsApi = {
  list: async (query?: ListQuery<ProjectFilters>): Promise<Paginated<Project>> => {
    const res = await api.get<Paginated<Project>>(E.project.base, { params: buildQuery(query) });
    return res.data;
  },
  get: async (id: string, query?: ListQuery): Promise<Project> => {
    const res = await api.get<ApiEnvelope<Project>>(E.project.byId(id), {
      params: buildQuery(query),
    });
    return res.data.data;
  },
  update: async (id: string, payload: Partial<Project>): Promise<Project> => {
    const res = await api.put<ApiEnvelope<Project>>(E.project.byId(id), payload);
    return res.data.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(E.project.byId(id));
  },
};
