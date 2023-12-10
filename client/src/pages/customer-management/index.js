import React, { useEffect, useState } from 'react';
import { Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';
import CustomerTable from './CustomerTable';
import { customerCustomersSelector } from 'store/slices/customer/customerSelector';
import CustomerDetail from './CustomerDetail';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3
};

const CustomerManagement = () => {
  const customers = useSelector(customerCustomersSelector);

  const [viewCustomerId, setViewCustomerId] = useState(null);

  const handleClose = () => setViewCustomerId(null);

  useEffect(() => {
    if (viewCustomerId) setViewCustomerId(null);
  }, [customers]);

  // return <CustomerDetail />;

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Customers</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <CustomerTable orderBy="id" order="asc" openViewForm={setViewCustomerId} />
        </MainCard>
      </Grid>
      <Modal
        open={Boolean(viewCustomerId)}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CustomerDetail id={viewCustomerId} />
        </Box>
      </Modal>
    </>
  );
};

export default CustomerManagement;
