import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import CreateOrderForm from './OrderForm';
import { useSelector } from 'react-redux';
import { orderCreateFetchStatusSelector } from 'store/slices/order/orderSelector';
import fetchStatus from 'constants/fetchStatuses';
import location from 'utils/location';

const CreateOrder = () => {
  const orderCreateFetchStatus = useSelector(orderCreateFetchStatusSelector);
  const navigate = useNavigate();
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (orderCreateFetchStatus === fetchStatus.SUCCESS) {
      navigate(location.allOrders());
    }
  }, [orderCreateFetchStatus]);

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Create new order</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1, p: 3 }} content={false}>
          <CreateOrderForm />
        </MainCard>
      </Grid>
    </>
  );
};

export default CreateOrder;
