import { clearAuthState } from 'store/slices/auth/authSlice';

const tokenExpirationMiddleware = () => (next) => (action) => {
  if (action.error && action.payload && action.payload.response && action.payload.response.status === 401) {
    localStorage.removeItem('token');
    next(clearAuthState());
  }
  return next(action);
};

export default tokenExpirationMiddleware;
