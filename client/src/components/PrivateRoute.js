import React from 'react';
import { Navigate } from 'react-router-dom';
import location from 'utils/location';
import useAuth from '../hooks/useAuth';
import useAccess from 'hooks/useAccess';
import Unauthorized from 'pages/unauthorized/index';

export const PrivateRoute = ({ children, loader = null, role, permission, ...props }) => {
  const { authenticated, loading } = useAuth();
  const { hasPermission, hasRole } = useAccess();
  if (loading) {
    return loader;
  }

  if (!authenticated) {
    return <Navigate to={location.loginUrl()} replace={true} />;
  }

  if (role && !hasRole(role)) {
    return <Unauthorized />;
  }

  if (permission && !hasPermission(permission)) {
    return <Unauthorized />;
  }

  return children;
};
