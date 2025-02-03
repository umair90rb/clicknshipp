import formatDate from 'utils/format-date';
import { Link, Grid, Stack, Typography, Card, CardContent, Button, Chip, ButtonGroup } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCancelOrderBooking, fetchOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import OrderItemTable from './OrderItemTable';
import OrderSummaryCard from './OrderSummaryCard';
import location from 'utils/location';
import CourierDropdownModal from './CourierDropdownModal';
import TrackingModal from './TrackingModal';
import StatusModal from './StatusModal';
import History from './History';
// import OldOrders from './OldOrders';
import DuplicateOrders from './DuplicateOrders';
import OrderPayments from './PaymentsTable';
import { authUserSelector } from 'store/slices/auth/authSelector';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { setNextPreOrder } from 'store/slices/order/orderSlice';
import { orderNextOrderSelector, orderPreOrderSelector } from 'store/slices/order/orderSelector';
import Customer from './Customer';
import Note from './Note';
import Delivery from './Delivery';
import useQuery from 'hooks/useQuery';

const OrderView = () => {
  const { orderId } = useParams();
  const queryObj = useQuery();
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
  const {
    id,
    order_number,
    subtotal_price,
    remarks,
    chanel,
    status,
    user,
    total_discounts,
    total_price,
    total_tax,
    address,
    items,
    payments,
    customer,
    createdAt,
    history,
    delivery: orderDelivery,
    duplicate: duplicateOrders
  } = order || {};
  const [orderStatus, setOrderStatus] = useState('');
  const [delivery, setDelivery] = useState(orderDelivery);
  const { email, id: customerId, shopify_id, name, note, phone } = customer || {};
  const { city, zip, address1, address2, phone: address_phone } = address || {};
  const authUser = useSelector(authUserSelector);
  const nextOrder = useSelector(orderNextOrderSelector);
  const preOrder = useSelector(orderPreOrderSelector);
  const [canUpdate, setCanUpdate] = useState(order?.user?.id === authUser?.id);
  const { hasPermission } = useAccess();

  const getOrderDetails = () =>
    dispatch(fetchOrder({ id: orderId })).then((action) => {
      if (action.type === 'order/fetch/fulfilled') {
        setOrder(action.payload?.data?.order);
        setOrderStatus(action.payload?.data?.order?.status);
        setCanUpdate(action.payload?.data?.order?.user?.id === authUser?.id);
      } else {
        setError(action.payload?.error || 'Something goes wrong!');
        dispatch(setMessage({ type: 'error', message: action.payload?.error || 'Something goes wrong!' }));
      }
      setLoading(false);
    });

  useEffect(() => {
    getOrderDetails();
    dispatch(setNextPreOrder(orderId));
  }, [orderId]);

  // useEffect(() => {
  //   console.log(queryObj.entries(), 'queryObj');
  // }, []);

  const trackOrder = async () => {
    if (delivery) {
      switch (delivery?.courier) {
        case 'leopard':
          await navigator.clipboard.writeText(delivery?.cn);
          window.open(`https://www.leopardscourier.com/leopards-tracking`, '_blank');
          break;
        case 'deawoo':
          await navigator.clipboard.writeText(delivery?.cn);
          window.open(`https://fastex.pk`, '_blank');
          break;
        case 'postex':
          window.open(`https://merchant.postex.pk?cn=${delivery?.cn}`, '_blank');
          break;
        case 'tcs':
          window.open(`https://www.tcsexpress.com/track/${delivery?.cn}`, '_blank');
          break;
        case 'callcourier':
          window.open(`https://callcourier.com.pk/tracking/?tc=${delivery?.cn}`, '_blank');
          break;
        case 'trax':
          window.open(`https://sonic.pk/api/shipment/track/consignee/public?tracking_number=${delivery?.cn}`, '_blank');
          break;
        default:
          break;
      }
    }
  };

  const handleCancelDelivery = () => {
    dispatch(fetchCancelOrderBooking({ id: orderId })).then((action) => {
      if (action.type === 'order/cancelOrderBooking/fetch/fulfilled') {
        setOrder(action.payload?.data?.order);
        getOrderDetails();
      } else {
        // setError(action.payload?.error || 'Something goes wrong!');
        dispatch(setMessage({ type: 'error', message: action.payload?.error?.message || 'Something goes wrong!' }));
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
                  <Button variant="outlined" disabled={orderStatus !== 'Booked'} onClick={trackOrder} color="primary">
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
            {/* {(orderStatus === 'Confirmed' || orderStatus === 'Booked') && (
              <Grid item>
                <Button variant="outlined" disabled={orderStatus !== 'Confirmed'} onClick={showAddCityModal} color="primary">
                  Add Courier City
                </Button>
              </Grid>
            )} */}
            {(hasPermission(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS) || canUpdate) && (
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
            )}
            {(hasPermission(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS) || canUpdate) && (
              <Grid item>
                <Button variant="contained" onClick={() => navigate(location.createOrder(), { state: { order } })} color="primary">
                  Update
                </Button>
              </Grid>
            )}
            <Grid item>
              <ButtonGroup disableElevation variant="contained" aria-label="Previous next order button">
                <Button
                  onClick={() => navigate(`/order/${preOrder}`)}
                  disabled={preOrder === null}
                  startIcon={<ArrowBackIosNewOutlinedIcon />}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => navigate(`/order/${nextOrder}`)}
                  disabled={nextOrder === null}
                  endIcon={<ArrowForwardIosOutlinedIcon />}
                >
                  Next
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card sx={{ minWidth: 275, padding: 2 }}>
            <CardContent sx={{ padding: 0 }}>
              <Typography variant="h5">Order Items</Typography>
              <OrderItemTable orderItems={items} onDelete={() => {}} />
            </CardContent>
          </Card>
          {payments && Array.isArray(payments) && payments.length > 0 && (
            <Card sx={{ minWidth: 275, padding: 2, mt: 2 }}>
              <CardContent sx={{ padding: 0 }}>
                <Typography variant="h5">Order Payments</Typography>
                <OrderPayments orderPayments={payments} />
              </CardContent>
            </Card>
          )}
          <OrderSummaryCard payments={payments} discount={total_discounts} subtotal={subtotal_price} tax={total_tax} total={total_price} />
          {duplicateOrders && duplicateOrders.length > 0 && <DuplicateOrders duplicateOrders={duplicateOrders} />}
          <History orderHistory={history} />
        </Grid>
        <Grid item xs={4}>
          <Note note={note} remarks={remarks} chanel={chanel} user={user} />
          <Customer
            customerId={customerId}
            shopify_id={shopify_id}
            name={name}
            email={email}
            phone={phone}
            city={city}
            zip={zip}
            address_phone={address_phone}
            address2={address2}
          />
          {(delivery || orderDelivery) && <Delivery delivery={delivery || orderDelivery} />}
        </Grid>
      </Grid>

      <CourierDropdownModal
        visible={showBookModal}
        onClose={hideBookingModal}
        updateOrderStatus={setOrderStatus}
        updateDeliveryData={setDelivery}
        orderId={id}
      />
      <StatusModal visible={showOrderStatusUpdateModal} onClose={hideOrderStatusModal} setOrderStatus={setOrderStatus} orderId={id} />
      <TrackingModal visible={showTrackModal} onClose={hideTrackingModal} orderId={id} />
      {/* <AddCityModal city={city} visible={addCityModalVisible} onClose={hideAddCityModal} /> */}
    </Stack>
  );
};

export default OrderView;
