import React from 'react';
import { Navigate } from 'react-router-dom';
import location from 'utils/location';
import useAuth from '../hooks/useAuth';

export const PrivateRoute = ({ children, loader = null, role, permission, ...props }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return loader;
  }

  if (!authenticated) {
    return <Navigate to={location.loginUrl()} replace={true} />;
  }

  return children;
};
