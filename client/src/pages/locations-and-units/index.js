import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useSelector } from 'react-redux';
// import CategoryTable from './CategoryTable';
// import BrandTable from './BrandTable';
// import AddUpdateForm from './AddUpdateForm';
import { categoryCategoriesSelector } from 'store/slices/category/categorySelector';
import { brandBrandsSelector } from 'store/slices/brand/brandSelector';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import LocationTable from './LocationTable';
import UnitsTable from './UnitTable';
import AddUpdateForm from './AddUpdateForm';

export default function LocationsAndUnits() {
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState('');
  const [updateData, setUpdateData] = useState();

  const categories = useSelector(categoryCategoriesSelector);
  const brands = useSelector(brandBrandsSelector);

  const { hasPermission } = useAccess();

  const openModalHandler = (t) => {
    setType(t);
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setType('');
    setUpdateData(undefined);
    setOpenModal(false);
  };

  const handleUpdate = (type, data) => {
    setType(type);
    setUpdateData(data);
    setOpenModal(true);
  };

  useEffect(() => {
    if (openModal) {
      setOpenModal(false);
      setType('');
    }
  }, [categories, brands]);
  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Store Locations</Typography>
          </Grid>

          <Grid item>
            <Grid container spacing={2}>
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_LOCATION) && (
                <Grid item>
                  <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => openModalHandler('Location')}>
                    Add Store Location
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_UNIT_OF_MEASURE) && (
                <Grid item>
                  <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => openModalHandler('Unit')}>
                    Add Unit Of Measure
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {hasPermission(PERMISSIONS.PERMISSION_VIEW_LOCATIONS) && (
          <MainCard sx={{ mt: 2 }} content={false}>
            <LocationTable handleUpdate={handleUpdate} />
          </MainCard>
        )}

        <Grid item xs={12} md={7} lg={8} sx={{ mt: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Units</Typography>
            </Grid>
          </Grid>
        </Grid>

        {hasPermission(PERMISSIONS.PERMISSION_VIEW_UNIT_OF_MEASURES) && (
          <MainCard sx={{ mt: 2 }} content={false}>
            <UnitsTable handleUpdate={handleUpdate} />
          </MainCard>
        )}
      </Grid>
      <AddUpdateForm type={type} data={updateData} visible={openModal} onClose={closeModalHandler} />
    </>
  );
}
