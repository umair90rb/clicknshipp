import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { chanelChanelsSelector } from 'store/slices/chanel/chanelSelector';
import ChanelTable from './ChanelTable';
import AddUpdateForm from './AddUpdateForm';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';

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

const ChanelManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const chanels = useSelector(chanelChanelsSelector);
  const [chanelToUpdate, setChanelToUpdate] = useState();
  const { hasPermission } = useAccess();

  const addSupplierHandler = () => {
    setChanelToUpdate(undefined);
    setOpenModal(true);
  };

  const updateChanelHandler = (chanel) => {
    setChanelToUpdate(chanel);
    setOpenModal(true);
  };

  useEffect(() => {
    if (openModal) {
      setOpenModal(false);
    }
  }, [chanels]);
  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Chanels</Typography>
          </Grid>
          {hasPermission(PERMISSIONS.PERMISSION_VIEW_SALES_CHANEL) && (
            <Grid item>
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={addSupplierHandler}>
                Add New Sales Chanel
              </Button>
            </Grid>
          )}
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ChanelTable updateChanelHandler={updateChanelHandler} />
        </MainCard>
      </Grid>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddUpdateForm chanelToUpdate={chanelToUpdate} />
        </Box>
      </Modal>
    </>
  );
};

export default ChanelManagement;
