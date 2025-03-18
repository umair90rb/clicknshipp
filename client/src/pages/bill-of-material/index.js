import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BillOfMaterialTable from './BillOfMaterialTable';
import AddBillOfMaterialForm from './AddBillOfMaterialForm';
import ViewBillOfMaterialModal from './ViewBillOfMaterialModal';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import CustomButton from 'components/CustomButton';

export default function BOM() {
  const { hasPermission } = useAccess();
  const [addFormModal, setAddFormModal] = useState(false);

  const [bomIdForView, setBomIdForView] = useState(null);
  const [bomViewModelVisible, setBomViewModelVisible] = useState(false);

  const handleView = (id) => {
    setBomIdForView(id);
    setBomViewModelVisible(true);
  };

  const closeViewModel = () => {
    setBomViewModelVisible(false);
    setBomIdForView(null);
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Bill Of Materials</Typography>
          </Grid>
          {hasPermission(PERMISSIONS.PERMISSION_RECEIVE_STOCK) && (
            <Grid item>
              <CustomButton text="Create Bill Of Material" Icon={AddOutlinedIcon} onClick={() => setAddFormModal(true)} />
            </Grid>
          )}
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <BillOfMaterialTable handleView={handleView} />
        </MainCard>
      </Grid>
      <AddBillOfMaterialForm visible={addFormModal} onClose={() => setAddFormModal(false)} />
      <ViewBillOfMaterialModal id={bomIdForView} visible={bomViewModelVisible} onClose={closeViewModel} />
    </>
  );
}
