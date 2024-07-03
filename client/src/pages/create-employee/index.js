import React from 'react';
import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const CreateEmployee = () => {
  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Add New Employee</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1, p: 3 }} content={false}></MainCard>
      </Grid>
    </>
  );
};

export default CreateEmployee;
