import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined, FileExcelOutlined, LoadingOutlined } from '@ant-design/icons';
import { styled } from '@mui/material/styles';
import DeliveryServiceAccountTable from './DeliveryServiceAccountTable';
// import AddItemForm from './AddItemForm';
import { useDispatch, useSelector } from 'react-redux';
import { itemItemsSelector } from 'store/slices/item/itemSelector';
import { fetchAllItem, fetchImportItems } from 'store/slices/item/fetchItem';
import { setMessage } from 'store/slices/util/utilSlice';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import CreateUpdateForm from './CreateUpdateForm';
import { deliveryServiceAccountsListSelector } from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';

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

const DeliveryServiceAccountsManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const [accountToUpdate, setAccountToUpdate] = useState();
  const { hasPermission } = useAccess();
  const accounts = useSelector(deliveryServiceAccountsListSelector);

  const updateAccountHandler = (item) => {
    setAccountToUpdate(item);
    setOpenModal(true);
  };

  const addAccountHandler = () => {
    setAccountToUpdate(undefined);
    setOpenModal(true);
  };

  useEffect(() => {
    if (openModal) {
      setOpenModal(false);
    }
  }, [accounts]);

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Delivery Service Accounts</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_DELIVERY_ACCOUNTS) && (
                <Grid item>
                  <Button variant="contained" startIcon={<PlusOutlined />} onClick={addAccountHandler}>
                    Add Account
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <DeliveryServiceAccountTable updateAccountHandler={updateAccountHandler} />
        </MainCard>
      </Grid>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreateUpdateForm account={accountToUpdate} />
        </Box>
      </Modal>
    </>
  );
};

export default DeliveryServiceAccountsManagement;
