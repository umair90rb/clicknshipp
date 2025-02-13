import React from 'react';
import { Navigate } from 'react-router-dom';
import location from 'utils/location';
import useAuth from '../hooks/useAuth';
import useAccess from 'hooks/useAccess';
import Unauthorized from 'pages/unauthorized/index';

export const PrivateRoute = ({ children, loader = null, permission }) => {
  const { authenticated, loading } = useAuth();
  const { hasPermission } = useAccess();
  if (loading) {
    return loader;
  }

  if (!authenticated) {
    return <Navigate to={location.loginUrl()} replace={true} />;
  }

  if (permission && !hasPermission(permission)) {
    return <Unauthorized />;
  }

  return children;
};
