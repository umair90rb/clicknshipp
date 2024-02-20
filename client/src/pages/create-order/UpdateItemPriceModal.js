import React from 'react';

// material-ui
import { Button, MenuItem, Select, FormHelperText, Grid, ListItemText, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'components/@extended/AnimateButton';

export default function UpdateItemPriceModal({ itemForUpdate, updateItem, hideModal }) {
  const handleUpdateItem = (values) => {
    const item = {
      ...itemForUpdate.item,
      price: values.price,
      reason: `Price changed from ${itemForUpdate.item.price} to ${values.price}. ${values.reason}`
    };
    updateItem(itemForUpdate.index, item);
    hideModal();
  };

  return (
    <>
      <Formik
        initialValues={{
          price: itemForUpdate?.item?.price,
          reason: ''
        }}
        validationSchema={Yup.object().shape({
          price: Yup.string().required('Price is required'),
          reason: Yup.string().required('Reason is required')
        })}
        onSubmit={handleUpdateItem}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="price-signup">Updated Price</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                    id="price-login"
                    type="number"
                    value={values.price}
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="250"
                    inputProps={{}}
                  />
                  {touched.price && errors.price && (
                    <FormHelperText error id="helper-text-price-signup">
                      {errors.price}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="reason-signup">Reason</InputLabel>
                  <OutlinedInput
                    fullWidth
                    multiline
                    rows={3}
                    error={Boolean(touched.reason && errors.reason)}
                    id="reason-login"
                    type="text"
                    value={values.reason}
                    name="reason"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Price updated!"
                    inputProps={{}}
                  />
                  {touched.reason && errors.reason && (
                    <FormHelperText error id="helper-text-reason-signup">
                      {errors.reason}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Update Price
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
