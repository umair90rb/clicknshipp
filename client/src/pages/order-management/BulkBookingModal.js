import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Box, Typography } from '@mui/material';
import { fetchBookAllOrder } from 'store/slices/order/fetchOrder';
import useSocket from 'hooks/useSocket';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function BulkBookingModal({ visible, onClose }) {
  const { socket, connect } = useSocket();
  const [count, setCount] = useState('loading...');
  const [courierWiseOrders, serCourierWiseOrders] = useState({ tcs: { success: 1, failed: 1 }, trax: { success: 1, failed: 1 } });

  useEffect(() => {
    if (visible) {
      connect();
      socket?.emit('booking');
      socket?.on('booking:count', (count) => setCount(count));
      socket?.on('booking:single:success', (data) =>
        serCourierWiseOrders((ps) => ({
          ...ps,
          [data.courier]: { success: ps[data.courier].success + 1, failed: ps[data.courier].failed }
        }))
      );
      socket?.on('booking:single:error', (data) =>
        serCourierWiseOrders((ps) => ({
          ...ps,
          [data.courier]: { failed: ps[data.courier].failed + 1, success: ps[data.courier].success }
        }))
      );
    }

    return () => {
      socket?.off('booking:count');
      socket?.off('booking:single:success');
      socket?.off('booking:single:error');
      setCount('loading...');
    };
  }, [visible]);

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="assign-order-modal" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography>Book Today&apos;s All Confirmed Orders (In Progress...)</Typography>
        <Typography>Total no of orders for booking {count}</Typography>
        <Typography>Courier: Booked/Failed</Typography>
        {Object.keys(courierWiseOrders).map((key, index) => (
          <Typography key={index}>
            {key}: {courierWiseOrders[key].success}/{courierWiseOrders[key].failed}
          </Typography>
        ))}
      </Box>
    </Modal>
  );
}
