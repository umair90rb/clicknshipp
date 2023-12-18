import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { categoryCategoriesSelector } from 'store/slices/category/categorySelector';
import CategoryTable from './CategoryTable';
import BrandTable from './BrandTable';

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
  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Categories</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => {}}>
                  Add Category
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => {}}>
                  Add Brand
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <CategoryTable />
        </MainCard>
        <Grid item xs={12} md={7} lg={8} sx={{ mt: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Brands</Typography>
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <BrandTable />
        </MainCard>
      </Grid>
      <Modal open={false} onClose={() => {}} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}></Box>
      </Modal>
    </>
  );
};

export default CategoriesAndBrands;
