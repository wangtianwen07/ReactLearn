import axios, { AxiosError, type AxiosAdapter, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import {
  clearSession,
  createTokenStorage,
  getCurrentSessionUser,
  setSession,
  updateSessionTokens,
  type TokenStorage,
} from '@react-learn/auth';
import type {
  AppRole,
  AuthTokens,
  CurrentUser,
  DashboardMetric,
  LoginPayload,
  LoginResult,
  TicketRecord,
  UserRecord,
} from '@react-learn/shared';
import { currentUser, dashboardMetrics } from '@react-learn/shared';

export interface ApiErrorShape {
  code: string;
  message: string;
  traceId?: string;
}

export interface ApiClientOptions {
  baseURL?: string;
  getToken?: () => string | null;
  tokenStorage?: TokenStorage;
  adapter?: AxiosAdapter;
  refreshTokens?: (refreshToken: string) => Promise<AuthTokens>;
  onAuthFailure?: () => void;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface MockAccount {
  password: string;
  user: CurrentUser;
}

const demoUsersByRole: Record<AppRole, CurrentUser> = {
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

const demoAccounts: Record<string, MockAccount> = {
  'super.admin': { password: 'Admin@123', user: demoUsersByRole.SUPER_ADMIN },
  'org.admin': { password: 'Admin@123', user: demoUsersByRole.ORG_ADMIN },
  'ticket.agent': { password: 'Agent@123', user: demoUsersByRole.AGENT },
};

const mockAuthStats = {
  refreshCalls: 0,
};

let authFailureHandler: (() => void) | null = null;
const sharedTokenStorage = createTokenStorage();

export function buildAuthorizationHeader(token: string | null | undefined): string | undefined {
  return token ? `Bearer ${token}` : undefined;
}

function createMockTokens(role: AppRole): AuthTokens {
  const issuedAt = Date.now();

  return {
    accessToken: `access|${role}|${issuedAt}`,
    refreshToken: `refresh|${role}|${issuedAt}`,
    expiresAt: issuedAt + 15 * 60 * 1000,
  };
}

export function normalizeApiError(error: unknown): ApiErrorShape {
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    const errorRecord = error as ApiErrorShape;
    return {
      code: errorRecord.code,
      message: errorRecord.message,
      traceId: errorRecord.traceId,
    };
  }

  if (error instanceof AxiosError) {
    return {
      code: error.response?.data?.code ?? 'NETWORK_ERROR',
      message: error.response?.data?.message ?? error.message,
      traceId: error.response?.data?.traceId,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : '未知异常',
  };
}

export function getApiErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}

function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { status?: number } }).response;
    return response?.status;
  }

  return undefined;
}

export function createApiClient(options: ApiClientOptions = {}): AxiosInstance {
  const tokenStorage = options.tokenStorage ?? createTokenStorage();
  let refreshPromise: Promise<AuthTokens> | null = null;

  const client = axios.create({
    baseURL: options.baseURL ?? '/api',
    timeout: 10000,
    adapter: options.adapter,
  });

  client.interceptors.request.use((config) => {
    const accessToken = options.getToken?.() ?? tokenStorage.getTokens()?.accessToken ?? null;
    const authorization = buildAuthorizationHeader(accessToken);
    if (authorization) {
      config.headers.Authorization = authorization;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorShape>) => {
      const requestConfig = error.config as RetryableRequestConfig | undefined;
      const isUnauthorized = getErrorStatus(error) === 401;
      const refreshToken = tokenStorage.getTokens()?.refreshToken;

      if (isUnauthorized && requestConfig && !requestConfig._retry && refreshToken) {
        requestConfig._retry = true;

        if (!refreshPromise) {
          const refreshHandler = options.refreshTokens ?? refreshTokenMock;
          refreshPromise = refreshHandler(refreshToken)
            .then((tokens) => {
              tokenStorage.setTokens(tokens);
              updateSessionTokens(tokens);
              return tokens;
            })
            .catch((refreshError) => {
              tokenStorage.clearTokens();
              clearSession();
              options.onAuthFailure?.();
              throw normalizeApiError(refreshError);
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const refreshedTokens = await refreshPromise;
        requestConfig.headers.Authorization = buildAuthorizationHeader(refreshedTokens.accessToken);
        return client(requestConfig);
      }

      return Promise.reject(normalizeApiError(error));
    }
  );

  return client;
}

export function registerAuthFailureHandler(handler: (() => void) | null): void {
  authFailureHandler = handler;
}

export const apiClient = createApiClient({
  tokenStorage: sharedTokenStorage,
  onAuthFailure: () => {
    authFailureHandler?.();
  },
});

const users: UserRecord[] = [
  {
    id: 'u-101',
    name: '张楠',
    email: 'zhangnan@corp.local',
    phone: '138****1024',
    department: '运营交付部',
    status: 'ENABLED',
  },
  {
    id: 'u-102',
    name: '李航',
    email: 'lihang@corp.local',
    phone: '139****0021',
    department: '平台研发部',
    status: 'DISABLED',
  },
];

const tickets: TicketRecord[] = [
  {
    id: 't-001',
    title: '客户工单：审批流程异常',
    status: 'PROCESSING',
    priority: 'P1',
    assignee: '赵云',
  },
  {
    id: 't-002',
    title: 'IAM 菜单权限校验不一致',
    status: 'OPEN',
    priority: 'P2',
    assignee: '王静',
  },
];

function sleep(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDemoAccounts(): Array<{ username: string; password: string; role: AppRole }> {
  return Object.entries(demoAccounts).map(([username, account]) => ({
    username,
    password: account.password,
    role: account.user.role,
  }));
}

export async function loginMock(payload: LoginPayload): Promise<LoginResult> {
  await sleep(200);

  const account = demoAccounts[payload.username.trim()];
  if (!account || account.password !== payload.password) {
    throw {
      code: 'AUTH_INVALID_CREDENTIALS',
      message: '用户名或密码错误',
      traceId: `trace-login-${Date.now()}`,
    } satisfies ApiErrorShape;
  }

  return {
    user: account.user,
    tokens: createMockTokens(account.user.role),
  };
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const result = await loginMock(payload);
  setSession(result);
  return result;
}

export async function refreshTokenMock(refreshToken: string): Promise<AuthTokens> {
  await sleep(120);
  mockAuthStats.refreshCalls += 1;

  const [, role] = refreshToken.split('|') as ['refresh', AppRole | undefined, string | undefined];
  if (!role) {
    throw {
      code: 'AUTH_REFRESH_FAILED',
      message: '刷新令牌无效',
      traceId: `trace-refresh-${Date.now()}`,
    } satisfies ApiErrorShape;
  }

  return createMockTokens(role);
}

export async function refreshSession(): Promise<AuthTokens> {
  const refreshToken = sharedTokenStorage.getTokens()?.refreshToken;

  if (!refreshToken) {
    throw {
      code: 'AUTH_REFRESH_REQUIRED',
      message: '缺少 refresh token，无法刷新登录态',
      traceId: `trace-refresh-required-${Date.now()}`,
    } satisfies ApiErrorShape;
  }

  const tokens = await refreshTokenMock(refreshToken);
  sharedTokenStorage.setTokens(tokens);
  return tokens;
}

export async function logout(): Promise<void> {
  await sleep(80);
  sharedTokenStorage.clearTokens();
  clearSession();
}

export function getAuthMockStats(): { refreshCalls: number } {
  return { ...mockAuthStats };
}

export function resetAuthMockStats(): void {
  mockAuthStats.refreshCalls = 0;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  await sleep();
  return getCurrentSessionUser() ?? currentUser;
}

export async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  await sleep();
  return dashboardMetrics;
}

export async function listUsers(keyword = ''): Promise<UserRecord[]> {
  await sleep();
  if (!keyword.trim()) {
    return users;
  }
  return users.filter((user) => {
    const haystack = `${user.name}${user.email}${user.department}`.toLowerCase();
    return haystack.includes(keyword.toLowerCase());
  });
}

export async function createUser(payload: Omit<UserRecord, 'id' | 'status'>): Promise<UserRecord> {
  await sleep();
  const newUser: UserRecord = {
    id: `u-${users.length + 101}`,
    status: 'ENABLED',
    ...payload,
  };
  users.unshift(newUser);
  return newUser;
}

export async function listTickets(status?: TicketRecord['status'] | 'ALL'): Promise<TicketRecord[]> {
  await sleep();
  if (!status || status === 'ALL') {
    return tickets;
  }
  return tickets.filter((ticket) => ticket.status === status);
}
