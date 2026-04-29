import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import type { ApiEnvelope, UploadedFile } from '@/types';

export const uploadsApi = {
  single: async (file: File): Promise<UploadedFile> => {
    const form = new FormData();
    form.append('file', file);
    const res = await api.post<ApiEnvelope<UploadedFile>>(E.upload.single, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  many: async (files: File[]): Promise<UploadedFile[]> => {
    const form = new FormData();
    for (const file of files) form.append('files', file);
    const res = await api.post<ApiEnvelope<UploadedFile[]>>(E.upload.many, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};
