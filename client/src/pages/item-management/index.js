import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import ItemTable from './ItemTable';
import AddItemForm from './AddItemForm';
import { useSelector } from 'react-redux';
import { itemItemsSelector } from 'store/slices/item/itemSelector';

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
  const [openModal, setOpenModal] = useState(false);
  const items = useSelector(itemItemsSelector);

  useEffect(() => {
    if (openModal) {
      setOpenModal(false);
    }
  }, [items]);

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Items List</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
              Add Item
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ItemTable order="desc" orderBy="id" />
        </MainCard>
      </Grid>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddItemForm />
        </Box>
      </Modal>
    </>
  );
};

export default ItemsManagement;
