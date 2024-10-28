import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Modal, Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { fetchCreateLocation, fetchUpdateLocation } from 'store/slices/location/fetchLocation';
import { createLocation, updateLocation } from 'store/slices/location/locationSlice';
import { createUnitOfMeasure, updateUnitOfMeasure } from 'store/slices/unitOfMeasure/unitOfMeasureSlice';
import { fetchCreateUnitOfMeasure, fetchUpdateUnitOfMeasure } from 'store/slices/unitOfMeasure/fetchUnitOfMeasure';

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

export default function AddUpdateForm({ type = '', data, visible, onClose }) {
  const dispatch = useDispatch();
  const formRef = useRef();

  const initialValues = {
    name: type === 'Unit' ? data?.unit || '' : data?.name || ''
  };

  const validationSchema = {
    name: Yup.string()
      .max(255)
      .required(`${type === 'Location' ? 'Store' : 'Unit'} name is required`)
  };

  if (type === 'Location') {
    initialValues.address = data?.address || '';
    validationSchema.address = Yup.string().max(255).required('Address is required');
  }

  const handleSubmit = async (values) => {
    if (type === 'Unit') {
      if (data) {
        return dispatch(fetchUpdateUnitOfMeasure({ id: data.id, body: values })).then((action) => {
          if (action.type === 'unitOfMeasure/update/fetch/fulfilled') {
            dispatch(updateUnitOfMeasure(action.payload.data.unit));
            onClose();
          }
        });
      }
      return dispatch(fetchCreateUnitOfMeasure({ body: values })).then((action) => {
        if (action.type === 'unitOfMeasure/create/fetch/fulfilled') {
          dispatch(createUnitOfMeasure(action.payload.data.unit));
          onClose();
        }
      });
    } else if (type === 'Location') {
      if (data) {
        return dispatch(fetchUpdateLocation({ id: data.id, body: values })).then((action) => {
          if (action.type === 'location/update/fetch/fulfilled') {
            dispatch(updateLocation(action.payload.data.location));
            onClose();
          }
        });
      }
      return dispatch(fetchCreateLocation({ body: values })).then((action) => {
        if (action.type === 'location/create/fetch/fulfilled') {
          dispatch(createLocation(action.payload.data.location));
          onClose();
        }
      });
    }
  };

  return (
    <Modal open={visible} onClose={onClose}>
      <Box sx={style}>
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={Yup.object().shape(validationSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name-signup">{type === 'Location' ? 'Store Name' : 'Unit'}</InputLabel>
                    <OutlinedInput
                      id="name-login"
                      type="name"
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder={type === 'Location' ? 'Main Store' : 'KG'}
                      fullWidth
                      error={Boolean(touched.name && errors.name)}
                    />
                    {touched.name && errors.name && (
                      <FormHelperText error id="helper-text-name-signup">
                        {errors.name}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                {type === 'Location' && (
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="address-signup">Store Address</InputLabel>
                      <OutlinedInput
                        id="address-login"
                        type="address"
                        value={values.address}
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Street # 10, Main Road"
                        fullWidth
                        error={Boolean(touched.address && errors.address)}
                      />
                      {touched.address && errors.address && (
                        <FormHelperText error id="helper-text-address-signup">
                          {errors.address}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                )}
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {`${data ? 'Update' : 'Add'} ${type === 'Location' ? 'Store' : 'Unit'}`}
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
