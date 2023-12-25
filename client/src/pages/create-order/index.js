import React from 'react';
import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import CreateOrderForm from './OrderForm';

const CreateOrder = () => {
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
