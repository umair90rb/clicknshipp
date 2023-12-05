import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(null);

  const logout = () => setAuthenticated(null);

  const value = {
    loading,
    authenticated,
    setLoading,
    setAuthenticated,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
