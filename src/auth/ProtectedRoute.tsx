import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './authUtils';
import { getCurrentUser } from '../services/authService';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [checkingSession, setCheckingSession] = useState(isAuthenticated());
  const [sessionValid, setSessionValid] = useState(isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated()) {
      setCheckingSession(false);
      setSessionValid(false);
      return;
    }

    let cancelled = false;

    getCurrentUser()
      .then(() => {
        if (!cancelled) setSessionValid(true);
      })
      .catch(() => {
        if (!cancelled) setSessionValid(false);
      })
      .finally(() => {
        if (!cancelled) setCheckingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-600 font-medium">
        Loading session...
      </div>
    );
  }

  if (!sessionValid) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
