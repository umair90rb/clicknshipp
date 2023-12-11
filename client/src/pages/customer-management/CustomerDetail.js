import CustomView from 'components/CustomTable';
import { CircularProgress, Divider, Grid, Stack, Typography } from '../../../node_modules/@mui/material/index';
import CustomerTable from './CustomerTable';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useLayoutEffect } from 'react';
import { fetchCustomer } from 'store/slices/customer/fetchCustomer';
import { customerViewDataSelector, customerViewErrorSelector, customerViewIsLoadingSelector } from 'store/slices/customer/customerSelector';

const customerOrderHeadCells = [
  {
    id: 'id',
    label: 'ID.'
  },
  {
    id: 'order_number',
    label: 'Order#'
  },
  {
    id: 'total_tax',
    label: 'Tax Amount'
  },
  {
    id: 'total_discounts',
    label: 'Discount'
  },
  {
    id: 'subtotal_price',
    label: 'Subtotal'
  },
  {
    id: 'total_price',
    label: 'Total Amount'
  },
  {
    id: 'createdAt',
    label: 'Received At'
  }
];

const CustomerDetail = ({ id }) => {
  const dispatch = useDispatch();
  const customerViewIsLoading = useSelector(customerViewIsLoadingSelector);
  const customerData = useSelector(customerViewDataSelector);
  const customerViewError = useSelector(customerViewErrorSelector);

  const { name, email, note, phone, Addresses, orders } = customerData || {};
  useLayoutEffect(() => {
    dispatch(fetchCustomer({ id }));
  }, []);

  if (customerViewIsLoading) {
    return (
      <Grid container spacing={2} minHeight={500}>
        <Grid xs display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  const renderAddresses = (addresses) =>
    addresses.map(({ address1, address2, city, zip, country, province }) => (
      <>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" size={20}>
              Address: {address1}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" size={20}>
              More Details: {address2}
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Typography variant="body1" size={20}>
              City: {city}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" size={20}>
              Zip code: {zip}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" size={20}>
              Province: {province}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" size={20}>
              Country: {country}
            </Typography>
          </Grid>
        </Grid>
      </>
    ));

  return (
    <>
      <Typography variant="h3">Customer Detail</Typography>
      <Divider />
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography variant="body1">Name: {name}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1">Email: {email || 'None'}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1">Phone: {phone || 'None'}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="body1" size={20}>
            Note: {note || 'None'}
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      {Addresses && renderAddresses(Addresses)}
      <Divider />
      <Stack>
        <Typography variant="h5">Orders</Typography>
        <Divider />
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomView order="desc" orderBy="id" data={orders || []} headCells={customerOrderHeadCells} />
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerDetail;
