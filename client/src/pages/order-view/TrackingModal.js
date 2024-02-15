import { useState } from 'react';
import { Typography } from '@mui/material';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';
import { fetchBookOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import CenterCircularLoader from 'components/CenterCircularLoader';

export default function TrackingModal({ orderId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getTrackingStatus = () => {
    setLoading(true);
    return dispatch(fetchBookOrder({ body: { orderId, service } })).then(({ type, payload }) => {
      if (type === 'order/book/fetch/fulfilled') {
        setLoading(false);
        updateOrderStatus('Booked');
        return dispatch(setMessage({ message: `Order booked with ${service} successfully`, type: 'success' }));
      }
      setLoading(false);
      return dispatch(setMessage({ message: payload.error || `Error! Order can't booked with ${service}.`, type: 'error' }));
    });
  };

  if (loading) {
    return <CenterCircularLoader />;
  }

  return <Typography>Tracking</Typography>;
}
