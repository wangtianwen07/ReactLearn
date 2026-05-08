import type { ReactNode } from 'react';
import { canAccessRoute, type RouteKey } from '@react-learn/auth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSessionSnapshot } from './useSessionSnapshot';

interface ProtectedRouteProps {
  routeKey?: RouteKey;
  children?: ReactNode;
}

export function ProtectedRoute({ routeKey, children }: ProtectedRouteProps) {
  const location = useLocation();
  const session = useSessionSnapshot();

  if (!session.isAuthenticated || !session.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (routeKey && !canAccessRoute(session.user.role, routeKey)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
