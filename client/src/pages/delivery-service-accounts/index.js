import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import DeliveryServiceAccountTable from './DeliveryServiceAccountTable';
// import AddItemForm from './AddItemForm';
import { useSelector } from 'react-redux';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import CreateUpdateDeliveryServiceAccountModal from './CreateUpdateDeliveryServiceAccountModal';
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
      <CreateUpdateDeliveryServiceAccountModal visible={openModal} onClose={() => setOpenModal(false)} account={accountToUpdate} />
    </>
  );
};

export default DeliveryServiceAccountsManagement;
