import formatDate from 'utils/format-date';
import { Grid, Stack, Typography, Card, CardContent, Button, Chip, Modal, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { useDispatch } from 'react-redux';
import { fetchConfirmOrder, fetchOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import OrderItemTable from './OrderItemTable';
import OrderSummaryCard from './OrderSummaryCard';
import location from 'utils/location';
import CourierDropdown from './CourierDropdown';
import TrackingModal from './TrackingModal';
import StatusModal from './StatusModal';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const OrderView = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showBookModal, setShowBookModal] = useState(false);
  const showBookingModal = () => setShowBookModal(true);
  const hideBookingModal = () => setShowBookModal(false);

  const [showTrackModal, setShowTrackModal] = useState(false);
  const showTrackingModal = () => setShowTrackModal(true);
  const hideTrackingModal = () => setShowTrackModal(false);

  const [showOrderStatusUpdateModal, setShowOrderStatusUpdateModal] = useState(false);
  const showOrderStatusModal = () => setShowOrderStatusUpdateModal(true);
  const hideOrderStatusModal = () => setShowOrderStatusUpdateModal(false);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState();
  const [error, setError] = useState(null);
  const { id, order_number, subtotal_price, status, total_discounts, total_price, total_tax, address, items, customer, createdAt } =
    order || {};
  const [orderStatus, setOrderStatus] = useState('');
  const { email, first_name, last_name, id: customerId, name, note, phone } = customer || {};
  const { city, zip, country, address1 } = address || {};
  useEffect(() => {
    dispatch(fetchOrder({ id: orderId })).then((action) => {
      if (action.type === 'order/fetch/fulfilled') {
        setOrder(action.payload?.data?.order);
        setLoading(false);
        setOrderStatus(action.payload?.data?.order?.status);
      } else {
        setError(action.payload?.error || 'Something goes wrong!');
        dispatch(setMessage({ message: action.payload?.error || 'Something goes wrong!' }));
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <CenterCircularLoader />;
  }

  if (error) {
    return null;
  }

  return (
    <Stack>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h4">
            #{order_number}{' '}
            <Chip color={orderStatus === 'Confirmed' ? 'success' : 'primary'} size="small" variant="elevated" label={orderStatus} />
          </Typography>
          <Typography color="grey" variant="subtitle2">
            {`${formatDate(createdAt)} from ${name}`}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
            {orderStatus === 'Booked' && (
              <Grid item>
                <Button variant="outlined" disabled={orderStatus !== 'Booked'} onClick={showTrackingModal} color="primary">
                  Track Order
                </Button>
              </Grid>
            )}
            {(orderStatus === 'Confirmed' || orderStatus === 'Booked') && (
              <Grid item>
                <Button variant="outlined" disabled={orderStatus !== 'Confirmed'} onClick={showBookingModal} color="primary">
                  Book Order
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                variant="outlined"
                disabled={orderStatus === 'Confirmed' || orderStatus === 'Booked'}
                onClick={showOrderStatusModal}
                color="success"
              >
                Update Order Status
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={orderStatus === 'Confirmed' || orderStatus === 'Booked'}
                onClick={() => navigate(location.createOrder(), { state: { order } })}
                color="primary"
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card sx={{ minWidth: 275, padding: 2 }}>
            <CardContent sx={{ padding: 0 }}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <OrderItemTable orderItems={items} onDelete={() => {}} />
            </CardContent>
          </Card>
          <OrderSummaryCard subtotal={subtotal_price} tax={total_tax} total={total_price} />
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                Note
              </Typography>
              <Typography paragraph>{note || 'None'}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275, mt: 1 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Customer
              </Typography>
              <Typography gutterBottom>Name: {name}</Typography>
              <Typography variant="h5" gutterBottom>
                Contact information
              </Typography>
              <Typography>{`Email: ${email || 'None'}`}</Typography>
              <Typography>{`Phone: ${phone || 'None'}`}</Typography>

              <Typography variant="h5" gutterBottom>
                Shipping Address
              </Typography>
              <Typography key={address1}>
                {address1} <br /> {city} {zip} <br /> {country}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Modal open={showBookModal} onClose={hideBookingModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <CourierDropdown updateOrderStatus={setOrderStatus} orderId={id} />
        </Box>
      </Modal>
      <Modal
        open={showTrackModal}
        onClose={hideTrackingModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TrackingModal orderId={id} />
        </Box>
      </Modal>
      <Modal
        open={showOrderStatusUpdateModal}
        onClose={hideOrderStatusModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <StatusModal hideOrderStatusModal={hideOrderStatusModal} orderId={id} />
        </Box>
      </Modal>
    </Stack>
  );
};

export default OrderView;
