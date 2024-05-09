import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Grid,
  ListItemText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Checkbox,
  Chip
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { batch, useDispatch, useSelector } from 'react-redux';
import { fetchAllSupplier, fetchCreateSupplier } from 'store/slices/supplier/fetchSupplier';
import { supplierFetchStatusSelector, supplierIsLoadingSelector, supplierSuppliersSelector } from 'store/slices/supplier/supplierSelector';
import { categoryCategoriesSelector, categoryFetchStatusSelector, categoryIsLoadingSelector } from 'store/slices/category/categorySelector';
import { brandBrandsSelector, brandFetchStatusSelector, brandIsLoadingSelector } from 'store/slices/brand/brandSelector';
import { fetchAllCategory } from 'store/slices/category/fetchCategory';
import { fetchAllBrand } from 'store/slices/brand/fetchBrand';
import { fetchCreateItem, fetchUpdateItem } from 'store/slices/item/fetchItem';
import { createItem, updateItem } from 'store/slices/item/itemSlice';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { setMessage } from 'store/slices/util/utilSlice';
import fetchStatus from 'constants/fetchStatuses';
import {
  fetchCreateDeliveryAccountService,
  fetchUpdateDeliveryAccountService
} from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';
import {
  addDeliveryServiceAccount,
  updateDeliveryServiceAccount
} from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSlice';

// ============================|| FIREBASE - REGISTER ||============================ //

const CreateUpdateForm = ({ account }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (account) {
      return dispatch(fetchUpdateDeliveryAccountService({ id: account?.id, body: values })).then((action) => {
        if (action.type === 'account/update/fetch/fulfilled') {
          dispatch(updateDeliveryServiceAccount(action.payload.data.account));
          dispatch(setMessage({ message: 'Account updated successfully.', type: 'success' }));
        } else {
          setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
        }
      });
    }
    return dispatch(fetchCreateDeliveryAccountService({ body: values })).then((action) => {
      if (action.type === 'account/create/fetch/fulfilled') {
        dispatch(addDeliveryServiceAccount(action.payload.data.account));
        dispatch(setMessage({ message: 'Account created successfully.', type: 'success' }));
      } else {
        setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
      }
    });
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          service: account?.service || '',
          key: account?.key || '',
          username: account?.username || '',
          password: account?.password || '',
          active: account?.active || true
        }}
        validationSchema={Yup.object().shape({
          service: Yup.string().max(255).required('Service name is required'),
          key: Yup.string().max(255).required('Key is required'),
          username: Yup.string().max(255).required('Username is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="service-signup">Service Name</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.service && errors.service)}
                    id="service-signup"
                    type="text"
                    value={values.service}
                    name="service"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="TCS"
                  />
                  {touched.service && errors.service && (
                    <FormHelperText error id="helper-text-service-signup">
                      {errors.service}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="key-signup">Key</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.key && errors.key)}
                    id="key-signup"
                    type="text"
                    value={values.key}
                    name="key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="***************"
                  />
                  {touched.key && errors.key && (
                    <FormHelperText error id="helper-text-key-signup">
                      {errors.key}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="username-signup">Username (if any)</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                    id="username-signup"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="***************"
                  />
                  {touched.username && errors.username && (
                    <FormHelperText error id="helper-text-username-signup">
                      {errors.username}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password (if any)</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type="text"
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="***************"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
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
                    {account ? 'Update Deliver Service Account' : 'Create Deliver Service Account'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CreateUpdateForm;
