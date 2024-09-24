import { useEffect, useState } from 'react';
import { FormControl, Select, Modal, Box, InputLabel, MenuItem, Button } from '@mui/material';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';
import { fetchBookOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import { fetchDeliveryServiceAccounts } from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';
import { useSelector } from 'react-redux';
import { deliveryServiceAccountsListSelector } from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 150,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function CourierDropdownModal({ visible, onClose, orderId, updateOrderStatus, updateDeliveryData }) {
  const dispatch = useDispatch();
  const servicesList = useSelector(deliveryServiceAccountsListSelector);
  const [serviceAccount, setServiceAccount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setServiceAccount(event.target.value);
  };

  const handleBook = async () => {
    setLoading(true);
    const { type, payload } = await dispatch(fetchBookOrder({ body: { orderId, accountId: serviceAccount } }));
    if (type === 'order/book/fetch/fulfilled') {
      updateOrderStatus('Booked');
      updateDeliveryData(payload.data.delivery);
      dispatch(setMessage({ message: `Order booked with successfully`, type: 'success' }));
      onClose();
    } else {
      dispatch(setMessage({ message: typeof payload?.error === 'string' ? payload.error : `Error! Order can't booked!`, type: 'error' }));
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(fetchDeliveryServiceAccounts());
  }, []);

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <FormControl sx={{ minWidth: '100%' }}>
          <InputLabel id="courier-services">Select Courier Account</InputLabel>
          <Select
            disabled={loading}
            labelId="courier-services"
            id="courier-services-select"
            value={serviceAccount}
            label="Services"
            onChange={handleChange}
            placeholder={loading && 'loading...'}
          >
            {servicesList.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
          <Button disabled={loading} onClick={handleBook} endIcon={loading && <LoadingOutlined />} sx={{ mt: 1 }} variant="contained">
            Book
          </Button>
        </FormControl>
      </Box>
    </Modal>
  );
}
