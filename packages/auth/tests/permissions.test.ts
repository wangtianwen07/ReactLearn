import { describe, expect, it } from 'vitest';
import { ACTION_KEYS, ROUTE_KEYS, canAccessAction, canAccessRoute, getDataScopeDescription } from '../src';

describe('auth permission helpers', () => {
  it('allows ORG_ADMIN to access user create and ticket board', () => {
    expect(canAccessAction('ORG_ADMIN', ACTION_KEYS.userCreate)).toBe(true);
    expect(canAccessRoute('ORG_ADMIN', ROUTE_KEYS.ticketBoard)).toBe(true);
  });

  it('prevents AGENT from entering IAM user route', () => {
    expect(canAccessRoute('AGENT', ROUTE_KEYS.iamUsers)).toBe(false);
  });

  it('returns role-specific data scope description', () => {
    expect(getDataScopeDescription('ORG_ADMIN', 'iam')).toContain('组织');
  });
});
