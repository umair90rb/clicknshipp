import { useEffect, useState } from 'react';
import { FormControl, Select, InputLabel, MenuItem, Button } from '@mui/material';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';
import { fetchBookOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import { fetchDeliveryServiceAccounts } from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';
import { useSelector } from 'react-redux';
import {
  deliveryServiceAccountsIsLoadingSelector,
  deliveryServiceAccountsListSelector
} from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';
import CircularLoader from 'components/CircularLoader';

const SERVICES = [
  ['Leapard', 'leopard'],
  ['Deawoo', 'deawoo'],
  ['PostEx', 'postex'],
  ['TCS', 'tcs'],
  ['Call Courier', 'callcourier'],
  ['Trax', 'trax']
];

export default function CourierDropdown({ orderId, updateOrderStatus }) {
  const dispatch = useDispatch();
  // const servicesList = useSelector(deliveryServiceAccountsListSelector);
  // const servicesListIsLoading = useSelector(deliveryServiceAccountsIsLoadingSelector);
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setService(event.target.value);
  };

  const handleBook = () => {
    setLoading(true);
    return dispatch(fetchBookOrder({ body: { orderId, service } })).then(({ type, payload }) => {
      if (type === 'order/book/fetch/fulfilled') {
        setLoading(false);
        updateOrderStatus('Booked');
        return dispatch(setMessage({ message: `Order booked with successfully`, type: 'success' }));
      }
      setLoading(false);
      return dispatch(setMessage({ message: payload.error || `Error! Order can't booked!`, type: 'error' }));
    });
  };

  // useEffect(() => {
  //   dispatch(fetchDeliveryServiceAccounts());
  // }, []);

  // if (servicesListIsLoading) {
  //   return <CircularLoader />;
  // }

  return (
    <FormControl sx={{ minWidth: '100%' }}>
      <InputLabel id="courier-services">Select Courier Service</InputLabel>
      <Select
        disabled={loading}
        labelId="courier-services"
        id="courier-services-select"
        value={service}
        label="Services"
        onChange={handleChange}
      >
        {SERVICES.map(([name, value], index) => (
          <MenuItem key={index} value={value}>
            {name}
          </MenuItem>
        ))}
      </Select>
      <Button disabled={loading} onClick={handleBook} endIcon={loading && <LoadingOutlined />} sx={{ mt: 1 }} variant="contained">
        Book
      </Button>
    </FormControl>
  );
}
