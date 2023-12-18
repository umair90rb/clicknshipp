import React from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import ItemTable from './ItemTable';

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

const ItemsManagement = () => {
  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Items List</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => {}}>
              Add Item
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ItemTable />
        </MainCard>
      </Grid>
      <Modal open={false} onClose={() => {}} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}></Box>
      </Modal>
    </>
  );
};

export default ItemsManagement;
