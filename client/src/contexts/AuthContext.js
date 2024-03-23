import { createContext, useEffect, useState } from 'react';
import { useSelector } from '../../node_modules/react-redux/es/exports';
import { authFetchStatusSelector } from 'store/slices/auth/authSelector';
import fetchStatus from 'constants/fetchStatuses';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('token'));

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthenticated(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthenticated(null);
  };

  const value = {
    loading,
    authenticated,
    setLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
