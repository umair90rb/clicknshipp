import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import SupplierTable from './SupplierTable';
import AddSupplierForm from './AddSupplierForm';
import { useSelector } from 'react-redux';
import { supplierSuppliersSelector } from 'store/slices/supplier/supplierSelector';

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

const SupplierManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const suppliers = useSelector(supplierSuppliersSelector);

  useEffect(() => {
    if (openModal) {
      setOpenModal(false);
    }
  }, [suppliers]);
  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Suppliers</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
              Add Supplier
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <SupplierTable />
        </MainCard>
      </Grid>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddSupplierForm />
        </Box>
      </Modal>
    </>
  );
};

export default SupplierManagement;
