import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { ArrowRightOutlined } from '@ant-design/icons';
import StockTable from './StockTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const StockManamgement = () => {
  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Current Inventory</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<ArrowRightOutlined />} onClick={() => {}}>
              Receive Inventory
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <StockTable />
        </MainCard>
      </Grid>
      <Modal open={false} onClose={() => {}} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}></Box>
      </Modal>
    </>
  );
};

export default StockManamgement;
