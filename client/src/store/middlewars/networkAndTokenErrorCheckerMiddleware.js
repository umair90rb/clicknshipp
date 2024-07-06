import { isRejected } from '@reduxjs/toolkit';
import { setMessage } from 'store/slices/util/utilSlice';
import { clearAuthState } from 'store/slices/auth/authSlice';

const networkAndTokenErrorCheckerMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (isRejected(action)) {
      const error = action.payload?.response?.statusText || action.payload?.error;
      const message = action.payload?.message || 'Something went wrong! Please try again.';
      const status = action.payload?.response?.status;
      if (error === 'ERR_NETWORK') {
        dispatch(
          setMessage({
            type: 'error',
            message
          })
        );
      }
      if (status === 401 || error === 'Authentication Failed') {
        localStorage.removeItem('token');
        dispatch(clearAuthState());
        window.location.href = '/login';
      }
    }
    return next(action);
  };

export default networkAndTokenErrorCheckerMiddleware;
