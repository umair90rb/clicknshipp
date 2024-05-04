import { setMessage } from 'store/slices/util/utilSlice';

const networkErrorCheckerMiddleware = () => (next) => (action) => {
  console.log(/rejected/g.test(action.type), `/rejected/g.test(${action.type})`);
  if (/rejected/g.test(action.type)) {
    const error = action.payload?.code;
    const message = action.payload?.message;
    console.log(error, message, 'error, message');
    if (error === 'ERR_NETWORK') {
      next(
        setMessage({
          type: 'error',
          message
        })
      );
    }
  }
  return next(action);
};

export default networkErrorCheckerMiddleware;
