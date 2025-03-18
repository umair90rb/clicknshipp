import React, { memo, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import StartIcon from '@mui/icons-material/Start';
import AddIcon from '@mui/icons-material/Add';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import OrderTable from './OrderTable';
import { useNavigate } from 'react-router-dom';
import location from 'utils/location';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import BulkUploadModal from './BulkUploadModal';
import AssignOrderModal from './AssignOrderModal';
import AddCourierCityModal from './AddCityModal';
import CustomButton from 'components/CustomButton';

const OrderManagement = memo(() => {
  const navigate = useNavigate();
  const { hasPermission } = useAccess();

  const [bulkOrderModalVisible, setBulkOrderModalVisible] = useState(false);
  const showBulkOrderModal = () => setBulkOrderModalVisible(true);
  const hideBulkOrderModal = () => setBulkOrderModalVisible(false);

  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const showAssignModal = () => setAssignModalVisible(true);
  const hideAssignModal = () => setAssignModalVisible(false);

  const [addCityModalVisible, setAddCityModalVisible] = useState(false);
  const showAddCityModal = () => setAddCityModalVisible(true);
  const hideAddCityModal = () => setAddCityModalVisible(false);

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Orders</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              {hasPermission(PERMISSIONS.PERMISSION_ADD_DELIVER_SERVICE_CITY) && (
                <Grid item>
                  <Button component="label" variant="contained" onClick={showAddCityModal} startIcon={<AddIcon />}>
                    Add Courier City
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_DAY_START) && (
                <Grid item>
                  <Button component="label" variant="contained" onClick={showAssignModal} startIcon={<StartIcon />}>
                    Day Start
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_BULK_ORDER) && (
                <Grid item>
                  <CustomButton text="Import Orders" onClick={showBulkOrderModal} Icon={UploadFileIcon} />
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_ORDER) && (
                <Grid item>
                  <Button variant="contained" startIcon={<WhatsAppIcon />} onClick={() => navigate(location.createOrder())}>
                    Whatsapp Order
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrderTable />
        </MainCard>
      </Grid>
      <BulkUploadModal visible={bulkOrderModalVisible} onClose={hideBulkOrderModal} />
      <AssignOrderModal visible={assignModalVisible} onClose={hideAssignModal} />
      <AddCourierCityModal visible={addCityModalVisible} onClose={hideAddCityModal} />
    </>
  );
});

export default OrderManagement;
