import { clearAuthState } from 'store/slices/auth/authSlice';
import { setMessage } from 'store/slices/util/utilSlice';

const tokenExpirationMiddleware = () => (next) => (action) => {
  if (/rejected/g.test(action.type)) {
    const error = action.payload?.response?.statusText || action.payload?.error;
    const status = action.payload?.response?.status;
    if (
      status === 401 ||
      (error && typeof error === 'string' && error?.toLowerCase().includes('unauthorized')) ||
      error === 'Authentication Failed'
    ) {
      localStorage.removeItem('token');
      next(clearAuthState());
      window.location.href = '/login';
    }
  }
  return next(action);
};

export default tokenExpirationMiddleware;
