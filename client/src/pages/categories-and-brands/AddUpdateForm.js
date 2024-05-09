import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Select,
  Checkbox,
  ListItemText,
  Chip,
  MenuItem,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { fetchCreateCategory, fetchUpdateCategory } from 'store/slices/category/fetchCategory';
import { createCategory, updateCategory } from 'store/slices/category/categorySlice';
import { fetchCreateBrand, fetchUpdateBrand } from 'store/slices/brand/fetchBrand';
import { createBrand, updateBrand } from 'store/slices/brand/brandSlice';
import { fetchDeliveryServiceAccounts } from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';

// ============================|| FIREBASE - REGISTER ||============================ //

const AddUpdateForm = ({ type = '', data }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const fetchDeliverServiceAccounts = async () => {
    setLoadingAccounts(true);
    const { type, payload } = await dispatch(fetchDeliveryServiceAccounts());
    if (type === 'accounts/fetch/fulfilled') {
      console.log(payload.data.accounts);
      setAccounts(payload.data.accounts);
    }
    setLoadingAccounts(false);
  };

  useEffect(() => {
    fetchDeliverServiceAccounts();
  }, []);

  const initialValues = {
    name: data?.name || ''
  };

  const validationSchema = {
    name: Yup.string().max(255).required(`${type} name is required`)
  };

  if (type === 'Brand') {
    initialValues.deliver_service_account_id = data?.deliver_service_account_id || '';
    initialValues.shipment_series = data?.shipment_series || '';
    validationSchema.deliver_service_account_id = Yup.number().required('Delivery service is required');
    validationSchema.shipment_series = Yup.number().min(1).required('Shipment series is required');
  }

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (type === 'Category') {
      if (data) {
        return dispatch(fetchUpdateCategory({ id: data.id, body: values })).then((action) => {
          if (action.type === 'category/update/fetch/fulfilled') {
            dispatch(updateCategory(action.payload.data.category));
          }
        });
      }
      return dispatch(fetchCreateCategory({ body: values })).then((action) => {
        if (action.type === 'category/create/fetch/fulfilled') {
          dispatch(createCategory(action.payload.data.category));
        }
      });
    } else if (type === 'Brand') {
      if (data) {
        return dispatch(fetchUpdateBrand({ id: data.id, body: values })).then((action) => {
          if (action.type === 'brand/update/fetch/fulfilled') {
            dispatch(updateBrand(action.payload.data.brand));
          }
        });
      }
      return dispatch(fetchCreateBrand({ body: values })).then((action) => {
        if (action.type === 'brand/create/fetch/fulfilled') {
          dispatch(createBrand(action.payload.data.brand));
        }
      });
    }
  };

  return (
    <>
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
                  <InputLabel htmlFor="name-signup">{`${type} Name`}</InputLabel>
                  <OutlinedInput
                    id="name-login"
                    type="name"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={`${type} name`}
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
              {type === 'Brand' && !loadingAccounts && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="deliver_service_account_id-signup">Delivery Service Account</InputLabel>
                    <Select
                      fullWidth
                      error={Boolean(touched.deliver_service_account_id && errors.deliver_service_account_id)}
                      id="deliver_service_account_id-signup"
                      value={values.deliver_service_account_id}
                      name="deliver_service_account_id"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      labelId="deliver_service_account_id-signup"
                    >
                      {accounts.map(({ id, service }) => (
                        <MenuItem key={id} value={id}>
                          <ListItemText primary={service} />
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.deliver_service_account_id && errors.deliver_service_account_id && (
                      <FormHelperText error id="helper-text-deliver_service_account_id-signup">
                        {errors.deliver_service_account_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              {type === 'Brand' && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="shipment_series-signup">Shipment Series</InputLabel>
                    <OutlinedInput
                      id="shipment_series-login"
                      type="shipment_series"
                      value={values.shipment_series}
                      name="shipment_series"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="543728"
                      fullWidth
                      error={Boolean(touched.shipment_series && errors.shipment_series)}
                    />
                    {touched.shipment_series && errors.shipment_series && (
                      <FormHelperText error id="helper-text-shipment_series-signup">
                        {errors.shipment_series}
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
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {`${data ? 'Update' : 'Create'} ${type}`}
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

export default AddUpdateForm;
