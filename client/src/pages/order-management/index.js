import React, { useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { FileExcelOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import SyncIcon from '@mui/icons-material/Sync';
import OrderTable from './OrderTable';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import location from 'utils/location';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrder, fetchImportOrder } from 'store/slices/order/fetchOrder';
import {
  orderImportFetchStatusSelector,
  orderImportIsLoadingSelector,
  orderPageSelector,
  orderPageSizeSelector
} from 'store/slices/order/orderSelector';
import fetchStatus from 'constants/fetchStatuses';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const OrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderImportIsLoading = useSelector(orderImportIsLoadingSelector);
  const orderImportFetchStatus = useSelector(orderImportFetchStatusSelector);
  const orderPaginationPage = useSelector(orderPageSelector);
  const orderPaginationPageSize = useSelector(orderPageSizeSelector);

  const uploadFile = (event) => {
    console.log(event.target.files, 'event.target.files');
    if (event.target.files === '') {
      return;
    }
    let formData = new FormData();
    formData.append('file', event.target.files[0], event.target.value.split(/(\\|\/)/g).pop());
    dispatch(fetchImportOrder({ body: formData })).then(() => {
      if (orderImportFetchStatus === fetchStatus.SUCCESS) {
        dispatch(fetchAllOrder());
      }
      event.target.value = '';
    });
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Orders</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<SyncIcon />}
                  onClick={() => dispatch(fetchAllOrder({ body: { page: orderPaginationPage, pageSize: orderPaginationPageSize } }))}
                >
                  Refresh
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component="label"
                  variant="contained"
                  disabled={orderImportIsLoading ? true : undefined}
                  startIcon={orderImportIsLoading ? <LoadingOutlined /> : <FileExcelOutlined />}
                >
                  Add Bulk Order
                  <VisuallyHiddenInput type="file" onChange={uploadFile} />
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => navigate(location.createOrder())}>
                  Create New Order
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrderTable />
        </MainCard>
      </Grid>
    </>
  );
};

export default OrderManagement;
