import type { AppRole, AuthTokens, CurrentUser, LoginResult, SessionSnapshot } from '@react-learn/shared';

const SESSION_STORAGE_KEY = 'reactlearn.session';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface TokenStorage {
  getTokens(): AuthTokens | null;
  setTokens(tokens: AuthTokens): void;
  clearTokens(): void;
}

type SessionListener = () => void;

const listeners = new Set<SessionListener>();

const anonymousSession: SessionSnapshot = {
  isAuthenticated: false,
  user: null,
  tokens: null,
};

let memoryStorageValue: string | null = null;
let currentSession: SessionSnapshot = anonymousSession;

function resolveStorage(storage?: StorageLike): StorageLike {
  if (storage) {
    return storage;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  return createMemoryStorage();
}

function notifySessionListeners(): void {
  listeners.forEach((listener) => listener());
}

function persistSession(snapshot: SessionSnapshot, storage?: StorageLike): void {
  const targetStorage = resolveStorage(storage);

  if (!snapshot.isAuthenticated || !snapshot.user || !snapshot.tokens) {
    targetStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  targetStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
}

export function createMemoryStorage(): StorageLike {
  return {
    getItem(key) {
      return key === SESSION_STORAGE_KEY ? memoryStorageValue : null;
    },
    setItem(key, value) {
      if (key === SESSION_STORAGE_KEY) {
        memoryStorageValue = value;
      }
    },
    removeItem(key) {
      if (key === SESSION_STORAGE_KEY) {
        memoryStorageValue = null;
      }
    },
  };
}

export function createTokenStorage(storage?: StorageLike): TokenStorage {
  return {
    getTokens() {
      return restoreSession(storage).tokens;
    },
    setTokens(tokens) {
      updateSessionTokens(tokens, storage);
    },
    clearTokens() {
      clearSession(storage);
    },
  };
}

export function subscribeSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSessionSnapshot(): SessionSnapshot {
  return currentSession;
}

export function restoreSession(storage?: StorageLike): SessionSnapshot {
  const targetStorage = resolveStorage(storage);
  const rawValue = targetStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawValue) {
    currentSession = anonymousSession;
    return currentSession;
  }

  try {
    const parsed = JSON.parse(rawValue) as SessionSnapshot;
    currentSession = parsed.user && parsed.tokens ? { ...parsed, isAuthenticated: true } : anonymousSession;
  } catch {
    currentSession = anonymousSession;
    targetStorage.removeItem(SESSION_STORAGE_KEY);
  }

  return currentSession;
}

export function setSession(result: LoginResult, storage?: StorageLike): SessionSnapshot {
  currentSession = {
    isAuthenticated: true,
    user: result.user,
    tokens: result.tokens,
  };
  persistSession(currentSession, storage);
  notifySessionListeners();
  return currentSession;
}

export function updateSessionTokens(tokens: AuthTokens, storage?: StorageLike): SessionSnapshot {
  currentSession = {
    isAuthenticated: Boolean(currentSession.user),
    user: currentSession.user,
    tokens,
  };
  persistSession(currentSession, storage);
  notifySessionListeners();
  return currentSession;
}

export function clearSession(storage?: StorageLike): SessionSnapshot {
  currentSession = anonymousSession;
  persistSession(currentSession, storage);
  notifySessionListeners();
  return currentSession;
}

export function isAuthenticated(): boolean {
  return currentSession.isAuthenticated && Boolean(currentSession.user && currentSession.tokens?.accessToken);
}

export function getAccessToken(): string | null {
  return currentSession.tokens?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return currentSession.tokens?.refreshToken ?? null;
}

export function getCurrentSessionUser(): CurrentUser | null {
  return currentSession.user;
}

export const ROUTE_KEYS = {
  dashboard: 'shell.dashboard',
  architecture: 'shell.architecture',
  permissions: 'shell.permissions',
  iamUsers: 'iam.users',
  iamRoles: 'iam.roles',
  ticketBoard: 'ticket.board',
} as const;

export const ACTION_KEYS = {
  userCreate: 'iam.user.create',
  userDisable: 'iam.user.disable',
  roleAssign: 'iam.role.assign',
  ticketAssign: 'ticket.ticket.assign',
  ticketClose: 'ticket.ticket.close',
} as const;

export type RouteKey = (typeof ROUTE_KEYS)[keyof typeof ROUTE_KEYS];
export type ActionKey = (typeof ACTION_KEYS)[keyof typeof ACTION_KEYS];

export interface DataScope {
  scopeType: 'ALL' | 'DEPT' | 'SELF';
  description: string;
}

export interface PermissionProfile {
  routes: RouteKey[];
  actions: ActionKey[];
  dataScopes: Record<string, DataScope>;
}

const permissionMap: Record<AppRole, PermissionProfile> = {
  SUPER_ADMIN: {
    routes: Object.values(ROUTE_KEYS),
    actions: Object.values(ACTION_KEYS),
    dataScopes: {
      iam: { scopeType: 'ALL', description: '查看全部组织与角色数据' },
      ticket: { scopeType: 'ALL', description: '可查看并处理全部工单' },
    },
  },
  ORG_ADMIN: {
    routes: [
      ROUTE_KEYS.dashboard,
      ROUTE_KEYS.architecture,
      ROUTE_KEYS.permissions,
      ROUTE_KEYS.iamUsers,
      ROUTE_KEYS.ticketBoard,
    ],
    actions: [ACTION_KEYS.userCreate, ACTION_KEYS.ticketAssign, ACTION_KEYS.ticketClose],
    dataScopes: {
      iam: { scopeType: 'DEPT', description: '仅查看所属组织用户数据' },
      ticket: { scopeType: 'DEPT', description: '仅查看本组织工单' },
    },
  },
  AGENT: {
    routes: [ROUTE_KEYS.dashboard, ROUTE_KEYS.ticketBoard],
    actions: [ACTION_KEYS.ticketClose],
    dataScopes: {
      ticket: { scopeType: 'SELF', description: '仅查看自己负责的工单' },
    },
  },
};

export function getPermissionProfile(role: AppRole): PermissionProfile {
  return permissionMap[role];
}

export function canAccessRoute(role: AppRole, routeKey: RouteKey): boolean {
  return permissionMap[role].routes.includes(routeKey);
}

export function canAccessAction(role: AppRole, actionKey: ActionKey): boolean {
  return permissionMap[role].actions.includes(actionKey);
}

export function getDataScopeDescription(role: AppRole, domain: string): string {
  return permissionMap[role].dataScopes[domain]?.description ?? '未配置数据权限';
}
