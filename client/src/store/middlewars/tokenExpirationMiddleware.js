import { clearAuthState } from 'store/slices/auth/authSlice';

const tokenExpirationMiddleware = () => (next) => (action) => {
  console.log(action, action.payload?.error, /rejected/g.test(action.type) && action.payload?.error === 'Authentication Failed');
  if (/rejected/g.test(action.type) && action.payload?.response?.status === 401) {
    localStorage.removeItem('token');
    next(clearAuthState());
    window.location = '/login';
  }
  return next(action);
};

export default tokenExpirationMiddleware;
