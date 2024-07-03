import { setMessage } from 'store/slices/util/utilSlice';
import { isRejected } from '@reduxjs/toolkit';

const networkAndTokenErrorCheckerMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (isRejected(action)) {
      const error = action.payload?.code;
      const message = action.payload?.message;
      const status = action.payload?.response?.status;
      if (error === 'ERR_NETWORK') {
        dispatch(
          setMessage({
            type: 'error',
            message
          })
        );
      }
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

export default networkAndTokenErrorCheckerMiddleware;
