import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { categoryCategoriesSelector } from 'store/slices/category/categorySelector';
import CategoryTable from './CategoryTable';
import BrandTable from './BrandTable';
import AddUpdateForm from './AddUpdateForm';
import { brandBrandsSelector } from 'store/slices/brand/brandSelector';
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

const CategoriesAndBrands = () => {
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
          {hasPermission(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS) && (
            <Grid item>
              <Typography variant="h5">Categories</Typography>
            </Grid>
          )}
          <Grid item>
            <Grid container spacing={2}>
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_CATEGORY) && (
                <Grid item>
                  <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => openModalHandler('Category')}>
                    Add Category
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_BRAND) && (
                <Grid item>
                  <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => openModalHandler('Brand')}>
                    Add Brand
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {hasPermission(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS) && (
          <MainCard sx={{ mt: 2 }} content={false}>
            <CategoryTable handleUpdate={handleUpdate} />
          </MainCard>
        )}
        {hasPermission(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS) && (
          <Grid item xs={12} md={7} lg={8} sx={{ mt: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Brands</Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        {hasPermission(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS) && (
          <MainCard sx={{ mt: 2 }} content={false}>
            <BrandTable handleUpdate={handleUpdate} />
          </MainCard>
        )}
      </Grid>
      <Modal open={openModal} onClose={closeModalHandler} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <AddUpdateForm type={type} data={updateData} />
        </Box>
      </Modal>
    </>
  );
};

export default CategoriesAndBrands;
