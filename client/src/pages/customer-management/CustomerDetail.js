import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Divider, Grid, Stack, Typography } from '../../../node_modules/@mui/material/index';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';
import { fetchCustomer } from 'store/slices/customer/fetchCustomer';
import { customerViewDataSelector, customerViewErrorSelector, customerViewIsLoadingSelector } from 'store/slices/customer/customerSelector';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { formatDateTime } from 'utils/format-date';

const customerOrderColumns = [
  {
    field: 'id',
    flex: 0.25,
    headerName: 'ID.'
  },
  {
    field: 'order_number',
    flex: 1,
    headerName: 'Order#'
  },
  {
    field: 'total_tax',
    flex: 1,
    headerName: 'Tax Amount'
  },
  {
    field: 'total_discounts',
    flex: 1,
    headerName: 'Discount'
  },
  {
    field: 'subtotal_price',
    flex: 1,
    headerName: 'Subtotal'
  },
  {
    field: 'total_price',
    flex: 1,
    headerName: 'Total Amount'
  },
  {
    field: 'createdAt',
    flex: 2,
    headerName: 'Received At',
    valueGetter: ({ value }) => formatDateTime(value, true)
  }
];

const customerAddressColumns = [
  {
    field: 'id',
    flex: 0.25,
    headerName: 'ID.'
  },
  {
    field: 'address1',
    flex: 1,
    headerName: 'Address'
  },
  {
    field: 'address2',
    flex: 1,
    headerName: 'Address 2'
  },
  {
    field: 'city',
    flex: 1,
    headerName: 'City'
  },
  {
    field: 'province',
    flex: 1,
    headerName: 'Province'
  },
  {
    field: 'country',
    flex: 1,
    headerName: 'Country'
  },
  {
    field: 'zip',
    flex: 1,
    headerName: 'Zip'
  }
];

const CustomerDetail = ({ id }) => {
  const dispatch = useDispatch();
  const customerViewIsLoading = useSelector(customerViewIsLoadingSelector);
  const customerData = useSelector(customerViewDataSelector);
  const customerViewError = useSelector(customerViewErrorSelector);

  const { name, email, note, phone, addresses, orders } = customerData || {};
  useLayoutEffect(() => {
    dispatch(fetchCustomer({ id }));
  }, []);

  if (customerViewIsLoading) {
    return <CenterCircularLoader />;
  }

  return (
    <>
      <Typography variant="h3">Customer Detail</Typography>
      <Divider />
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography variant="body1">Name: {name || 'None'}</Typography>
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ height: '35vh', width: '100%' }}>
            <DataGrid
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
              rows={addresses || []}
              columns={customerAddressColumns}
            />
          </div>
        </Grid>
      </Grid>
      <Divider />
      <Stack>
        <Typography variant="h5">Orders</Typography>
        <Divider />
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ height: '35vh', width: '100%' }}>
            <DataGrid
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
              rows={orders || []}
              columns={customerOrderColumns}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerDetail;
