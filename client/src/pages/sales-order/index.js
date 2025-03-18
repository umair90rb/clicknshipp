import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import AddSalesOrderModal from './AddSalesOrderModal';
import SalesOrderTable from './SalesOrderTable';
import { useDispatch } from 'react-redux';
import { setSalesOrderCreateModalVisible } from 'store/slices/salesOrder/salesOrderSlice';

export default function SalesOrder() {
  const dispatch = useDispatch();
  const { hasPermission } = useAccess();

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Sales Order</Typography>
          </Grid>
          {hasPermission(PERMISSIONS.PERMISSION_WRITE_SALES_ORDER) && (
            <Grid item>
              <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => dispatch(setSalesOrderCreateModalVisible(true))}>
                Create Sales Order
              </Button>
            </Grid>
          )}
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <SalesOrderTable />
        </MainCard>
      </Grid>
      <AddSalesOrderModal />
    </>
  );
}
