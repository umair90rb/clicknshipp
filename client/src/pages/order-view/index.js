import formatDate from 'utils/format-date';
import { Grid, Stack, Typography, Card, CardContent, Button, Chip, Modal, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { useDispatch } from 'react-redux';
import { fetchCancelOrderBooking, fetchOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import OrderItemTable from './OrderItemTable';
import OrderSummaryCard from './OrderSummaryCard';
import location from 'utils/location';
import CourierDropdown from './CourierDropdown';
import TrackingModal from './TrackingModal';
import StatusModal from './StatusModal';
import AddCityModal from './AddCityModal';
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

const courierServiceModalStyle = {
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

const trackingModalStyle = {
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

const OrderView = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showBookModal, setShowBookModal] = useState(false);
  const showBookingModal = () => setShowBookModal(true);
  const hideBookingModal = () => setShowBookModal(false);

  const [addCityModalVisible, setAddCityModalVisible] = useState(false);
  const showAddCityModal = () => setAddCityModalVisible(true);
  const hideAddCityModal = () => setAddCityModalVisible(false);

  const [showTrackModal, setShowTrackModal] = useState(false);
  const showTrackingModal = () => setShowTrackModal(true);
  const hideTrackingModal = () => setShowTrackModal(false);

  const [showOrderStatusUpdateModal, setShowOrderStatusUpdateModal] = useState(false);
  const showOrderStatusModal = () => setShowOrderStatusUpdateModal(true);
  const hideOrderStatusModal = () => setShowOrderStatusUpdateModal(false);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState();
  const [error, setError] = useState(null);
  const {
    id,
    order_number,
    subtotal_price,
    remarks,
    chanel,
    status,
    total_discounts,
    total_price,
    total_tax,
    address,
    items,
    customer,
    createdAt
  } = order || {};
  const [orderStatus, setOrderStatus] = useState('');
  const { email, first_name, last_name, id: customerId, shopify_id, name, note, phone } = customer || {};
  const { city, zip, country, address1, address2, phone: address_phone } = address || {};

  const getOrderDetails = () =>
    dispatch(fetchOrder({ id: orderId })).then((action) => {
      if (action.type === 'order/fetch/fulfilled') {
        setOrder(action.payload?.data?.order);
        setLoading(false);
        setOrderStatus(action.payload?.data?.order?.status);
      } else {
        setError(action.payload?.error || 'Something goes wrong!');
        dispatch(setMessage({ type: 'error', message: action.payload?.error || 'Something goes wrong!' }));
        setLoading(false);
      }
    });

  useEffect(() => {
    getOrderDetails();
  }, []);

  const handleCancelDelivery = () => {
    dispatch(fetchCancelOrderBooking({ id: orderId })).then((action) => {
      if (action.type === 'order/cancelOrderBooking/fetch/fulfilled') {
        setOrder(action.payload?.data?.order);
        getOrderDetails();
      } else {
        // setError(action.payload?.error || 'Something goes wrong!');
        dispatch(setMessage({ type: 'error', message: action.payload?.error || 'Something goes wrong!' }));
        // setLoading(false);
      }
    });
  };

  if (loading) {
    return <CenterCircularLoader />;
  }

  if (error) {
    return <Typography variant="h4">Something goes wrong during getting order data!</Typography>;
  }

  return (
    <Stack>
      <Grid container>
        <Grid item xs={3}>
          <Typography variant="h4">
            #{order_number}{' '}
            <Chip color={orderStatus === 'Confirmed' ? 'success' : 'primary'} size="small" variant="elevated" label={orderStatus} />
          </Typography>
          <Typography color="grey" variant="subtitle2">
            {`${formatDate(createdAt)} from ${name}`}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
            {orderStatus === 'Booked' && (
              <>
                <Grid item>
                  <Button variant="outlined" disabled={orderStatus !== 'Booked'} onClick={showTrackingModal} color="primary">
                    Track Order
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={handleCancelDelivery} color="primary">
                    Cancel Delivery
                  </Button>
                </Grid>
              </>
            )}
            {(orderStatus === 'Confirmed' || orderStatus === 'Booked') && (
              <Grid item>
                <Button variant="outlined" disabled={orderStatus !== 'Confirmed'} onClick={showBookingModal} color="primary">
                  Book Order
                </Button>
              </Grid>
            )}
            {(orderStatus === 'Confirmed' || orderStatus === 'Booked') && (
              <Grid item>
                <Button variant="outlined" disabled={orderStatus !== 'Confirmed'} onClick={showAddCityModal} color="primary">
                  Add Courier City
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                variant="outlined"
                disabled={orderStatus === 'Confirmed' || orderStatus === 'Deleted' || orderStatus === 'Booked'}
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
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                Remarks
              </Typography>
              <Typography paragraph>{remarks || 'None'}</Typography>
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                Chanel/Store: {(chanel && 'name' in chanel && chanel.name) || ''}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275, mt: 1 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Customer
              </Typography>
              <Typography gutterBottom>Name: {name}</Typography>
              <Typography gutterBottom>Customer System Id: {customerId || 'None'}</Typography>
              <Typography gutterBottom>Customer Shopify Id: {shopify_id || 'None'}</Typography>
              <Typography variant="h5" gutterBottom>
                Contact information
              </Typography>
              <Typography>{`Email: ${email || 'None'}`}</Typography>
              <Typography>{`Phone: ${phone || 'None'}`}</Typography>

              <Typography variant="h5" gutterBottom>
                Shipping Address
              </Typography>
              <Typography key={address1}>
                Address: {address1} <br /> City:{city} <br /> Zip:{zip || 'None'} <br /> Country: {country}
                <br /> Phone: {address_phone} <br /> Special Instruction: {address2}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Modal open={showBookModal} onClose={hideBookingModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={courierServiceModalStyle}>
          <CourierDropdown updateOrderStatus={setOrderStatus} orderId={id} />
        </Box>
      </Modal>
      <Modal
        open={showTrackModal}
        onClose={hideTrackingModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={trackingModalStyle}>
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
          <StatusModal hideOrderStatusModal={hideOrderStatusModal} setOrderStatus={setOrderStatus} orderId={id} />
        </Box>
      </Modal>
      <AddCityModal city={city} visible={addCityModalVisible} onClose={hideAddCityModal} />
    </Stack>
  );
};

export default OrderView;
