import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import type { ApiEnvelope, Transaction } from '@/types';

export interface CreditWalletPayload {
  userId: string;
  amount: number;
  note?: string;
}

export interface RefundProjectPayload {
  projectId: string;
  amount?: number;
  note?: string;
}

export const paymentApi = {
  creditWallet: async (payload: CreditWalletPayload): Promise<Transaction> => {
    const res = await api.post<ApiEnvelope<Transaction>>(E.payment.adminCredit, payload);
    return res.data.data;
  },
  refundProject: async (payload: RefundProjectPayload): Promise<Transaction> => {
    const res = await api.post<ApiEnvelope<Transaction>>(E.payment.refund, payload);
    return res.data.data;
  },
};
