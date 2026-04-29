/** Served from `public/brand/logo.png` — favicon and in-app branding */
export const BRAND_LOGO_URL = '/brand/logo.png';

export const ROUTES = {
  login: '/login',
  overview: '/',
  users: '/users',
  userDetails: (id: string) => `/users/${id}`,
  projects: '/projects',
  projectDetails: (id: string) => `/projects/${id}`,
  tickets: '/tickets',
  ticketDetails: (id: string) => `/tickets/${id}`,
  finance: '/finance',
  transactions: '/finance/transactions',
  transactionDetails: (id: string) => `/finance/transactions/${id}`,
  chat: '/chat',
  chatThread: (id: string) => `/chat/${id}`,
  notifications: '/notifications',
  activity: '/activity',
  settings: '/settings',
  profile: '/profile',
} as const;

export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  dashboard: {
    metrics: ['dashboard', 'metrics'] as const,
  },
  users: {
    list: 'users-list',
    detail: 'users-detail',
  },
  projects: {
    list: 'projects-list',
    detail: 'projects-detail',
  },
  tickets: {
    list: 'tickets-list',
    detail: 'tickets-detail',
  },
  transactions: {
    list: 'transactions-list',
    detail: 'transactions-detail',
  },
  notifications: {
    list: 'notifications-list',
    unread: 'notifications-unread',
  },
  chat: {
    list: 'chat-list',
    detail: 'chat-detail',
  },
  activity: {
    list: 'activity-list',
    recent: 'activity-recent',
  },
  settings: {
    current: 'settings-current',
  },
  reviews: {
    list: 'reviews-list',
  },
  paymentMethods: {
    list: 'payment-methods-list',
  },
  banks: {
    list: 'banks-list',
  },
} as const;

export const USER_ROLES = {
  admin: 'admin',
  client: 'client',
  freelancer: 'freelancer',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const TOKEN_COOKIE_NAME = 'wazzfly_admin_token';
export const TOKEN_COOKIE_DAYS = 30;

export const PROJECT_STATUS = ['open', 'in-progress', 'completed', 'cancelled', 'rejected'] as const;
export type ProjectStatus = (typeof PROJECT_STATUS)[number];

export const TICKET_STATUS = ['pending', 'closed'] as const;
export type TicketStatus = (typeof TICKET_STATUS)[number];

export const TICKET_TYPE = ['refund', 'scam'] as const;
export type TicketType = (typeof TICKET_TYPE)[number];

export const MILESTONE_STATUS = [
  'pending',
  'delivered',
  'approved',
  'rejected',
] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUS)[number];

export const TRANSACTION_TYPE = ['charge', 'transfer', 'Withdrawal', 'refund', 'credit'] as const;
export type TransactionType = (typeof TRANSACTION_TYPE)[number];
