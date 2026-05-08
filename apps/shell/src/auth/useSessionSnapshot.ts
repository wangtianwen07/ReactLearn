import { useSyncExternalStore } from 'react';
import { getSessionSnapshot, subscribeSession } from '@react-learn/auth';

export function useSessionSnapshot() {
  return useSyncExternalStore(subscribeSession, getSessionSnapshot, getSessionSnapshot);
}
