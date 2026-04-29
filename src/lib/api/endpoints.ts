export const E = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    resetPassword: '/auth/reset-password',
  },
  user: {
    base: '/user',
    me: '/user/me',
    byId: (id: string) => `/user/${id}`,
  },
  admin: {
    base: '/admin',
    me: '/admin/me',
    byId: (id: string) => `/admin/${id}`,
  },
  role: {
    base: '/role',
    byId: (id: string) => `/role/${id}`,
  },
  project: {
    base: '/project',
    byId: (id: string) => `/project/${id}`,
    assign: '/project/assign-freelancer',
    accept: '/project/accept-assignment',
    reject: '/project/reject-assignment',
    deliverMilestone: '/project/deliver-milestone',
    approveMilestone: '/project/approve-milestone',
    rejectMilestone: '/project/reject-milestone',
  },
  tickets: {
    base: '/tickets',
    byId: (id: string) => `/tickets/${id}`,
    addMessage: '/tickets/add-message',
    close: '/tickets/close',
  },
  notification: {
    base: '/notification',
    byId: (id: string) => `/notification/${id}`,
    markAllRead: '/notification/mark-all-read',
    markRead: (id: string) => `/notification/${id}/read`,
  },
  transaction: {
    base: '/transaction',
    byId: (id: string) => `/transaction/${id}`,
  },
  payment: {
    base: '/payment',
    byId: (id: string) => `/payment/${id}`,
    adminCredit: '/payment/admin-credit-wallet',
    refund: '/payment/refund-project',
    charge: '/payment/charge-wallet',
    chargeConfirm: '/payment/charge-wallet/confirm',
    withdraw: '/payment/withdraw',
  },
  setting: {
    base: '/setting',
    byId: (id: string) => `/setting/${id}`,
    dashboardMetrics: '/setting/dashboard-metrics',
  },
  bank: {
    base: '/bank',
    byId: (id: string) => `/bank/${id}`,
  },
  reviews: {
    base: '/reviews',
    byId: (id: string) => `/reviews/${id}`,
  },
  chat: {
    base: '/chat',
    byId: (id: string) => `/chat/${id}`,
    message: (id: string) => `/chat/${id}/message`,
  },
  activity: {
    base: '/activity',
    byId: (id: string) => `/activity/${id}`,
  },
  upload: {
    single: '/upload',
    many: '/upload/many',
    base: '/upload',
    byId: (id: string) => `/upload/${id}`,
  },
  paymentMethod: {
    base: '/payment-method',
    byId: (id: string) => `/payment-method/${id}`,
  },
  cache: { clear: '/clearCache' },
  logs: { clear: '/clearLogs' },
  health: { base: '/health' },
} as const;
