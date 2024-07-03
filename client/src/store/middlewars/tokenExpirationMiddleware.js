import { clearAuthState } from 'store/slices/auth/authSlice';
import { setMessage } from 'store/slices/util/utilSlice';
import { isRejected } from '@reduxjs/toolkit';

const tokenExpirationMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (isRejected(action)) {
      const error = action.payload?.response?.statusText || action.payload?.error;
      const status = action.payload?.response?.status;
      if (
        status === 401 ||
        (error && typeof error === 'string' && error?.toLowerCase().includes('unauthorized')) ||
        error === 'Authentication Failed'
      ) {
        localStorage.removeItem('token');
        dispatch(clearAuthState());
        window.location.href = '/login';
      }
    }
    return next(action);
  };

export default tokenExpirationMiddleware;
