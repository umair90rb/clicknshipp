import formatDate from 'utils/format-date';
import { Grid, Stack, Typography, Card, CardContent } from '../../../node_modules/@mui/material/index';
import { useParams } from '../../../node_modules/react-router-dom/dist/index';
import { useEffect, useState } from 'react';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { useDispatch } from 'react-redux';
import { fetchOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';

const Item = ({ item: { grams, id, name, price, product_id, quantity, sku, total_discount } }) => (
  <>
    <Typography variant="body1" gutterBottom>
      {`${name}(Sku: ${sku || 'None'}) Rs.${price} x ${quantity} Total: Rs.${price * quantity} Discount: ${total_discount || 'None'}`}
    </Typography>
  </>
);

const OrderView = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState();
  const [error, setError] = useState(null);
  const { id, order_number, subtotal_price, total_discounts, total_price, total_tax, OrderItems, Customer, createdAt } = order || {};
  const { Addresses, email, first_name, last_name, id: customerId, name, note, phone } = Customer || {};
  useEffect(() => {
    dispatch(fetchOrder({ id: orderId })).then((action) => {
      if (action.type === 'order/fetch/fulfilled') {
        setOrder(action.payload?.data?.order);
        setLoading(false);
      } else {
        setError(action.payload?.error || 'Something goes wrong!');
        dispatch(setMessage({ message: action.payload?.error || 'Something goes wrong!' }));
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    <CenterCircularLoader />;
  }

  if (error) {
    return null;
  }

  console.log(order);

  return (
    <Stack>
      <Typography variant="h4">#{order_number}</Typography>
      <Typography color="grey" variant="subtitle2">
        {`${formatDate(createdAt)} from ${name}`}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>{OrderItems && OrderItems.map((item) => <Item key={item.id} item={item} />)}</CardContent>
          </Card>

          <Card sx={{ minWidth: 275, mt: 1 }}>
            <CardContent></CardContent>
          </Card>
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
              <Typography>{`Email: ${email}`}</Typography>
              <Typography>{`Phone: ${phone}`}</Typography>

              <Typography variant="h5" gutterBottom>
                Shipping Address
              </Typography>
              {Addresses &&
                Addresses.map(({ address1, city, zip, country }) => (
                  <Typography key={address1}>
                    {address1} <br /> {city} {zip} <br /> {country}
                  </Typography>
                ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default OrderView;
