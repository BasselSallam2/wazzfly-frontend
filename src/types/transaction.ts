import type { TransactionType } from '@/config/constants';
import type { User } from './user';

export interface Transaction {
  _id: string;
  type: TransactionType | string;
  amount: number;
  status?: 'pending' | 'completed' | 'failed' | string;
  from?: string | User | null;
  to?: string | User | null;
  meta?: {
    project?: string;
    ticket?: string;
    note?: string;
    paymentId?: string;
    [k: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}
