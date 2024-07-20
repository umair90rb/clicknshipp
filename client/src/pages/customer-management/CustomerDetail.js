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
    field: 'createdAt',
    flex: 0.5,
    headerName: 'Received At',
    valueGetter: ({ value }) => formatDateTime(value, true)
  },
  {
    field: 'total_price',
    flex: 0.5,
    headerName: 'Total Amount'
  },
  {
    field: 'items',
    flex: 2,
    headerName: 'Items',
    valueGetter: (param) => {
      const items = param.row.items;
      if (!items || !items.length) {
        return 'None';
      }
      if (items && items.length === 1) {
        return `${items[0].name}/${items[0].quantity}`;
      }
      return items.reduce((pv, cv) => `${cv.name}/${cv.quantity}, ${pv}`, '');
    }
  },
  {
    field: 'total_discounts',
    flex: 0.5,
    headerName: 'Discount'
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
    flex: 2,
    headerName: 'Address'
  },
  {
    field: 'city',
    flex: 0.5,
    headerName: 'City'
  },
  {
    field: 'province',
    flex: 0.5,
    headerName: 'Province'
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
          <Typography variant="h5">Name: {name || 'None'}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5">Email: {email || 'None'}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5">Phone: {phone || 'None'}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" size={20}>
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
              getRowHeight={() => 'auto'}
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
              getRowHeight={() => 'auto'}
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
