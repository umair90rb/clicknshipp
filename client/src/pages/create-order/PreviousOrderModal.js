import { Box, Typography, Modal } from '@mui/material';
import OrderRow from 'layout/MainLayout/Header/HeaderContent/Search/OrderRow';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const PreviousOrderModal = ({ onClose, visible, orders }) => {
  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography variant="body1">Last 30 days orders</Typography>
        {orders.map((order, index) => (
          <OrderRow key={index} order={order} />
        ))}
      </Box>
    </Modal>
  );
};

export default PreviousOrderModal;
