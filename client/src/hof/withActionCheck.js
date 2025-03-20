import { useDispatch } from 'react-redux';
import { setMessage } from 'store/slices/util/utilSlice';

export default function withActionCheck(action, data, successCb, errorCb, successMsg, errorMsg) {
  return async () => {
    const dispatch = useDispatch();
    const { type, payload } = await dispatch(action(data));
    if (type === `${action.type}/fulfilled`) {
      dispatch(setMessage({ message: payload?.data?.message || successMsg || 'Operation successful', type: 'success' }));
      successCb(payload);
    } else if (type === `${action.type}/rejected`) {
      dispatch(setMessage({ message: payload?.error || errorMsg || 'Something goes wrong', type: 'error' }));
      errorCb(payload);
    }
    return { type, payload };
  };
}
