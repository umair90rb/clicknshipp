import { clearAuthState } from 'store/slices/auth/authSlice';

const tokenExpirationMiddleware = () => (next) => (action) => {
  console.log(/rejected/g.test(action.type), `/rejected/g.test(${action.type})`);
  if (/rejected/g.test(action.type)) {
    console.log(action.payload);
    const error = action.payload?.response?.statusText;
    const status = action.payload?.response?.status;
    console.log(error, status, 'error, status');
    if (status === 401 || (error && error.toLowerCase().includes('unauthorized'))) {
      localStorage.removeItem('token');
      next(clearAuthState());
      window.location.href = '/login';
    }
  }
  return next(action);
};

export default tokenExpirationMiddleware;
