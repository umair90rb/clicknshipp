import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import AddSalesOrderModal from './AddSalesOrderModal';

export default function SalesOrder() {
  const { hasPermission } = useAccess();
  const [visibleSalesOrder, setVisibleSalesOrder] = useState(false);

  const [bomIdForView, setBomIdForView] = useState(null);
  const [bomViewModelVisible, setBomViewModelVisible] = useState(false);

  const handleView = (id) => {
    setBomIdForView(id);
    setBomViewModelVisible(true);
  };

  const closeViewModel = () => {
    setBomViewModelVisible(false);
    setBomIdForView(null);
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Sales Order</Typography>
          </Grid>
          {hasPermission(PERMISSIONS.PERMISSION_RECEIVE_STOCK) && (
            <Grid item>
              <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setVisibleSalesOrder(true)}>
                Create Sales Order
              </Button>
            </Grid>
          )}
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {/* <BillOfMaterialTable handleView={handleView} /> */}
        </MainCard>
      </Grid>
      <AddSalesOrderModal visible={visibleSalesOrder} onClose={() => setVisibleSalesOrder(false)} />
    </>
  );
}
