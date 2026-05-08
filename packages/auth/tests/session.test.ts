import { beforeEach, describe, expect, it } from 'vitest';
import type { LoginResult } from '@react-learn/shared';
import {
  clearSession,
  createMemoryStorage,
  createTokenStorage,
  getSessionSnapshot,
  restoreSession,
  setSession,
} from '../src';

function createLoginResult(): LoginResult {
  return {
    user: {
      id: 'u-001',
      name: '赵云',
      orgName: '华北运营中心',
      role: 'ORG_ADMIN',
    },
    tokens: {
      accessToken: 'access|ORG_ADMIN|1',
      refreshToken: 'refresh|ORG_ADMIN|1',
      expiresAt: Date.now() + 60_000,
    },
  };
}

describe('auth session store', () => {
  const memoryStorage = createMemoryStorage();
  const tokenStorage = createTokenStorage(memoryStorage);

  beforeEach(() => {
    clearSession(memoryStorage);
  });

  it('persists and restores a session snapshot', () => {
    const result = createLoginResult();

    setSession(result, memoryStorage);
    const restored = restoreSession(memoryStorage);

    expect(restored.isAuthenticated).toBe(true);
    expect(restored.user?.role).toBe('ORG_ADMIN');
    expect(tokenStorage.getTokens()?.refreshToken).toBe(result.tokens.refreshToken);
  });

  it('clears session data and resets the snapshot', () => {
    setSession(createLoginResult(), memoryStorage);

    clearSession(memoryStorage);

    expect(getSessionSnapshot().isAuthenticated).toBe(false);
    expect(tokenStorage.getTokens()).toBeNull();
  });
});
