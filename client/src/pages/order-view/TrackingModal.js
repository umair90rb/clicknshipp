import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';
import { fetchBookOrder, fetchOrderBookingStatus } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import CenterCircularLoader from 'components/CenterCircularLoader';

export default function TrackingModal({ orderId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [deliveryStatus, setDeliveryStatus] = useState();

  const getTrackingStatus = () => {
    setLoading(true);
    return dispatch(fetchOrderBookingStatus({ id: orderId })).then(({ type, payload }) => {
      if (type === 'order/orderBookingStatus/fetch/fulfilled') {
        setDeliveryStatus(payload.data);
        setLoading(false);
        return;
      }
      setLoading(false);
      return dispatch(setMessage({ message: payload.error || `Error! Order booking can't tracked`, type: 'error' }));
    });
  };

  useEffect(() => {
    getTrackingStatus();
  }, []);

  if (loading) {
    return <CenterCircularLoader />;
  }
  return <Typography>{JSON.stringify(deliveryStatus)}</Typography>;
}
