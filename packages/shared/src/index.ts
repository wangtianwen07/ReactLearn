export type AppRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'AGENT';

export interface CurrentUser {
  id: string;
  name: string;
  orgName: string;
  role: AppRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SessionSnapshot {
  isAuthenticated: boolean;
  user: CurrentUser | null;
  tokens: AuthTokens | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  user: CurrentUser;
  tokens: AuthTokens;
}

export interface DashboardMetric {
  key: string;
  label: string;
  value: number;
  trend: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: 'ENABLED' | 'DISABLED';
}

export interface TicketRecord {
  id: string;
  title: string;
  status: 'OPEN' | 'PROCESSING' | 'DONE';
  priority: 'P1' | 'P2' | 'P3';
  assignee: string;
}

export interface ChildAppManifest {
  name: 'iam' | 'ticket';
  title: string;
  port: number;
  entry: string;
  activeRule: string;
  containerId: string;
  description: string;
}

export const demoUsersByRole: Record<AppRole, CurrentUser> = {
  SUPER_ADMIN: {
    id: 'u-000',
    name: '苏澈',
    orgName: '集团总部',
    role: 'SUPER_ADMIN',
  },
  ORG_ADMIN: {
    id: 'u-001',
    name: '赵云',
    orgName: '华北运营中心',
    role: 'ORG_ADMIN',
  },
  AGENT: {
    id: 'u-002',
    name: '王静',
    orgName: '客户成功一部',
    role: 'AGENT',
  },
};

export const currentUser: CurrentUser = demoUsersByRole.ORG_ADMIN;

export const dashboardMetrics: DashboardMetric[] = [
  { key: 'tickets-open', label: '待处理工单', value: 18, trend: '+12% vs 上周' },
  { key: 'users-enabled', label: '启用用户数', value: 86, trend: '+6 本周新增' },
  { key: 'approval-sla', label: 'SLA 达成率', value: 97, trend: '保持稳定' },
];

export const microAppManifests: ChildAppManifest[] = [
  {
    name: 'iam',
    title: 'IAM 权限域',
    port: 5174,
    entry: 'http://localhost:5174',
    activeRule: '/iam',
    containerId: 'micro-app-iam',
    description: '组织、用户、角色、菜单与权限资源管理。',
  },
  {
    name: 'ticket',
    title: 'Ticket 工单域',
    port: 5175,
    entry: 'http://localhost:5175',
    activeRule: '/ticket',
    containerId: 'micro-app-ticket',
    description: '工单流转、处理记录、SLA 与操作追踪。',
  },
];

export const shellHighlights = [
  'Vite + React 19 + TypeScript strict',
  'Ant Design + React Router + TanStack Query + Zustand',
  'packages/shared + packages/auth + packages/api 共享域能力',
  '按业务域拆分 shell / iam / ticket，预留 qiankun 接入位',
] as const;
