import { describe, expect, it } from 'vitest';
import { buildAuthorizationHeader, listUsers } from '../src';

describe('api package', () => {
  it('builds bearer token header', () => {
    expect(buildAuthorizationHeader('demo-token')).toBe('Bearer demo-token');
    expect(buildAuthorizationHeader(null)).toBeUndefined();
  });

  it('filters mock users by keyword', async () => {
    const users = await listUsers('平台');
    expect(users).toHaveLength(1);
    expect(users[0]?.department).toContain('平台');
  });
});
