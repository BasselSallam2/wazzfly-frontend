export interface AppSettings {
  _id: string;
  clientTax: number;
  freelancerTax: number;
  SystemWallet: number;
  allTimeCharges?: number;
  allTimePayouts?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  users: {
    total: number;
    clients: number;
    freelancers: number;
    admins: number;
    active?: number;
    new30d?: number;
  };
  projects: {
    total: number;
    active: number;
    byStatus: Record<string, number>;
    totalBudgetYTD?: number;
    disputed?: number;
  };
  tickets: {
    total: number;
    pending: number;
    closed: number;
    byStatus: Record<string, number>;
    byType?: Record<string, Record<string, number>>;
  };
  money: {
    SystemWallet: number;
    revenue: number;
    netProfit: number;
    allTimeCharges: number;
    allTimePayouts: number;
  };
  recent?: {
    activities?: unknown[];
    transactions?: unknown[];
  };
}
