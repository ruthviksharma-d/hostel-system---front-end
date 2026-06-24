import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserRole } from './authUtils';

type RoleProtectedRouteProps = {
  role: 'TENANT' | 'MAINTENANCE';
  children: React.ReactElement;
};

export default function RoleProtectedRoute({ role, children }: RoleProtectedRouteProps) {
  const location = useLocation();
  const userRole = getUserRole();

  // If not authenticated, ProtectedRoute will handle redirect.
  // If authenticated but wrong role, redirect to the user's dashboard.
  if (userRole !== role) {
    if (!userRole) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    const redirectTo = userRole === 'TENANT' ? '/tenant/dashboard' : '/maintenance/dashboard';
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  return children;
}
