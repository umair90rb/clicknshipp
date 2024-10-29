import React, { useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { FileExcelOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import ConfirmedOrderTable from './ConfirmedOrderTable';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import location from 'utils/location';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrder, fetchImportOrder } from 'store/slices/order/fetchOrder';
import { orderImportFetchStatusSelector, orderImportIsLoadingSelector } from 'store/slices/order/orderSelector';
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

const BookingManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderImportIsLoading = useSelector(orderImportIsLoadingSelector);
  const orderImportFetchStatus = useSelector(orderImportFetchStatusSelector);

  const uploadFile = (event) => {
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
            <Typography variant="h5">Confirmed Orders</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ConfirmedOrderTable />
        </MainCard>
      </Grid>
    </>
  );
};

export default BookingManagement;
