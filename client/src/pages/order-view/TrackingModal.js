import { useEffect, useState } from 'react';
import { Typography, Box, Modal } from '@mui/material';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';
import { fetchOrderBookingStatus } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import CenterCircularLoader from 'components/CenterCircularLoader';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function TrackingModal({ visible, onClose, orderId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [deliveryStatus, setDeliveryStatus] = useState();

  const getTrackingStatus = () => {
    setLoading(true);
    const promise = dispatch(fetchOrderBookingStatus({ id: orderId })).then(({ type, payload }) => {
      if (type === 'order/orderBookingStatus/fetch/fulfilled') {
        setDeliveryStatus(payload.data);
        setLoading(false);
        return;
      }
      setLoading(false);
      return dispatch(setMessage({ message: payload?.error || `Error! Order booking can't tracked`, type: 'error' }));
    });
    return promise;
  };

  useEffect(() => {
    if (visible) {
      getTrackingStatus();
    }
  }, [visible]);

  return (
    <Modal open={visible} onClose={onClose}>
      <Box sx={style}>{loading ? <CenterCircularLoader /> : <Typography overflow="auto">{JSON.stringify(deliveryStatus)}</Typography>}</Box>
    </Modal>
  );
}
