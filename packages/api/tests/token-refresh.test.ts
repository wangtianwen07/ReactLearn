import { beforeEach, describe, expect, it } from 'vitest';
import { createMemoryStorage, createTokenStorage, setSession } from '@react-learn/auth';
import type { AuthTokens, LoginResult } from '@react-learn/shared';
import { createApiClient } from '../src';

function createExpiredLoginResult(): LoginResult {
  return {
    user: {
      id: 'u-001',
      name: '赵云',
      orgName: '华北运营中心',
      role: 'ORG_ADMIN',
    },
    tokens: {
      accessToken: 'expired-access-token',
      refreshToken: 'refresh|ORG_ADMIN|1',
      expiresAt: Date.now() - 1000,
    },
  };
}

describe('api token refresh skeleton', () => {
  const memoryStorage = createMemoryStorage();
  const tokenStorage = createTokenStorage(memoryStorage);

  beforeEach(() => {
    tokenStorage.clearTokens();
  });

  it('refreshes only once for concurrent 401 responses and replays both requests', async () => {
    setSession(createExpiredLoginResult(), memoryStorage);
    let refreshCalls = 0;
    let requestCalls = 0;

    const client = createApiClient({
      tokenStorage,
      refreshTokens: async () => {
        refreshCalls += 1;
        return {
          accessToken: 'fresh-access-token',
          refreshToken: 'refresh|ORG_ADMIN|2',
          expiresAt: Date.now() + 60_000,
        } satisfies AuthTokens;
      },
      adapter: async (config) => {
        requestCalls += 1;
        const authHeader = String(config.headers?.Authorization ?? '');

        if (authHeader === 'Bearer expired-access-token') {
          throw {
            config,
            response: {
              status: 401,
              data: {
                code: 'AUTH_ACCESS_EXPIRED',
                message: 'access token 已过期',
              },
            },
          };
        }

        return {
          data: { ok: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      },
    });

    const [first, second] = await Promise.all([client.get('/secure'), client.get('/secure')]);

    expect(first.data.ok).toBe(true);
    expect(second.data.ok).toBe(true);
    expect(refreshCalls).toBe(1);
    expect(requestCalls).toBe(4);
    expect(tokenStorage.getTokens()?.accessToken).toBe('fresh-access-token');
  });

  it('clears auth state and invokes onAuthFailure when refresh fails', async () => {
    setSession(createExpiredLoginResult(), memoryStorage);
    let authFailureCalls = 0;

    const client = createApiClient({
      tokenStorage,
      onAuthFailure: () => {
        authFailureCalls += 1;
      },
      refreshTokens: async () => {
        throw {
          code: 'AUTH_REFRESH_FAILED',
          message: 'refresh token 失效',
        };
      },
      adapter: async (config) => {
        throw {
          config,
          response: {
            status: 401,
            data: {
              code: 'AUTH_ACCESS_EXPIRED',
              message: 'access token 已过期',
            },
          },
        };
      },
    });

    await expect(client.get('/secure')).rejects.toMatchObject({
      code: 'AUTH_REFRESH_FAILED',
    });
    expect(authFailureCalls).toBe(1);
    expect(tokenStorage.getTokens()).toBeNull();
  });
});
