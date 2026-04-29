import type { DashboardMetrics } from '@/types';

/**
 * Response shape from `POST /setting/dashboard-metrics` (see `setting.controller.ts`).
 * Money uses `profits` (DB `SystemWallet`), not `SystemWallet` / `revenue` / `netProfit`.
 */
export type DashboardMetricsApi = {
  users?: {
    clients?: number;
    freelancers?: number;
    total?: number;
    admins?: number;
  };
  projects?: {
    total?: number;
    byStatus?: Record<string, number>;
  };
  tickets?: {
    total?: number;
    byStatus?: Record<string, number>;
  };
  money?: {
    profits?: number;
    SystemWallet?: number;
    allTimeCharges?: number;
    allTimePayouts?: number;
    revenue?: number;
    netProfit?: number;
  };
};

function sumByKeys(map: Record<string, number> | undefined, keys: string[]): number {
  if (!map) return 0;
  return keys.reduce((acc, k) => acc + (map[k] ?? 0), 0);
}

export function normalizeDashboardMetrics(raw: DashboardMetricsApi): DashboardMetrics {
  const money = raw.money ?? {};
  const allTimeCharges = money.allTimeCharges ?? 0;
  const allTimePayouts = money.allTimePayouts ?? 0;

  // Backend signs singleton setting as `money.profits` (source: `SystemWallet` in Mongo).
  const systemWallet: number =
    typeof money.SystemWallet === 'number'
      ? money.SystemWallet
      : typeof money.profits === 'number'
        ? money.profits
        : 0;

  const users = raw.users ?? {};
  const projectMap = raw.projects?.byStatus;
  const ticketMap = raw.tickets?.byStatus;

  const activeProjects = sumByKeys(projectMap, ['open', 'in-progress']);
  const pendingTickets = ticketMap?.pending ?? 0;
  const closedTickets = ticketMap?.closed ?? 0;

  const netOperating = allTimeCharges - allTimePayouts;

  return {
    users: {
      total: users.total ?? 0,
      clients: users.clients ?? 0,
      freelancers: users.freelancers ?? 0,
      admins: users.admins ?? 0,
    },
    projects: {
      total: raw.projects?.total ?? 0,
      active: activeProjects,
      byStatus: projectMap ?? {},
    },
    tickets: {
      total: raw.tickets?.total ?? sumByKeys(ticketMap, ['pending', 'closed']),
      pending: pendingTickets,
      closed: closedTickets,
      byStatus: ticketMap ?? {},
    },
    money: {
      SystemWallet: systemWallet,
      revenue: typeof money.revenue === 'number' ? money.revenue : netOperating,
      netProfit: typeof money.netProfit === 'number' ? money.netProfit : systemWallet,
      allTimeCharges,
      allTimePayouts,
    },
  };
}
