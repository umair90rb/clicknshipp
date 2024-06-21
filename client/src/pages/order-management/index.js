import React, { memo, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import StartIcon from '@mui/icons-material/Start';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SyncIcon from '@mui/icons-material/Sync';
import OrderTable from './OrderTable';
import { useNavigate, useSearchParams } from 'react-router-dom';
import location from 'utils/location';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrder } from 'store/slices/order/fetchOrder';
import { orderFiltersSelector, orderPageSelector, orderPageSizeSelector, orderSortSelector } from 'store/slices/order/orderSelector';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import BulkUploadModal from './BulkUploadModal';
import AssignOrderModal from './AssignOrderModal';

const OrderManagement = memo(() => {
  const navigate = useNavigate();
  const [_, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const orderPaginationPage = useSelector(orderPageSelector);
  const orderPaginationPageSize = useSelector(orderPageSizeSelector);
  const orderFilters = useSelector(orderFiltersSelector);
  const orderSort = useSelector(orderSortSelector);
  const { hasPermission } = useAccess();

  const [bulkOrderModalVisible, setBulkOrderModalVisible] = useState(false);
  const showBulkOrderModal = () => setBulkOrderModalVisible(true);
  const hideBulkOrderModal = () => setBulkOrderModalVisible(false);

  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const showAssignModal = () => setAssignModalVisible(true);
  const hideAssignModal = () => setAssignModalVisible(false);

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Orders</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              {hasPermission(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS) && (
                <Grid item>
                  <Button component="label" variant="contained" onClick={showAssignModal} startIcon={<StartIcon />}>
                    Day Start
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<SyncIcon />}
                  onClick={() => {
                    setSearchParams({});
                    dispatch(
                      fetchAllOrder({
                        body: { sort: orderSort, page: orderPaginationPage, pageSize: orderPaginationPageSize, filters: orderFilters }
                      })
                    );
                  }}
                >
                  Refresh
                </Button>
              </Grid>
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_BULK_ORDER) && (
                <Grid item>
                  <Button component="label" variant="contained" onClick={showBulkOrderModal} startIcon={<UploadFileIcon />}>
                    Add Bulk Order
                  </Button>
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
    </>
  );
});

export default OrderManagement;
