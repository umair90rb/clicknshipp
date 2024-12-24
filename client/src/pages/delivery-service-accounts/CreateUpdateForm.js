import { useRef } from 'react';
import { Button, MenuItem, Select, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch } from 'react-redux';
import { setMessage } from 'store/slices/util/utilSlice';
import {
  fetchCreateDeliveryAccountService,
  fetchUpdateDeliveryAccountService
} from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';
import {
  addDeliveryServiceAccount,
  updateDeliveryServiceAccount
} from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSlice';
import SERVICES from 'constants/services';

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
          name: account?.name || '',
          service: account?.service || '',
          key: account?.key || '',
          client_id: account?.client_id || '',
          cost_center: account?.cost_center || '',
          username: account?.username || '',
          password: account?.password || '',
          active: account?.active || true
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          service: Yup.string().max(255).required('Service type is required'),
          key: Yup.string().max(255),
          client_id: Yup.string().max(255),
          cost_center: Yup.string().max(255),
          username: Yup.string().max(255),
          password: Yup.string().max(255)
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">Account Name</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                    id="name-signup"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="TCS for sukoon"
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="helper-text-name-signup">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel id="courier-service-type">Select Courier Service</InputLabel>
                  <Select
                    error={Boolean(touched.service && errors.service)}
                    labelId="courier-service-type"
                    id="courier-service-type-select"
                    value={values.service}
                    name="service"
                    label="courier-service-type"
                    onChange={handleChange}
                  >
                    {SERVICES.map(([name, value], index) => (
                      <MenuItem key={index} value={value}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
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
                  <InputLabel htmlFor="client_id-signup">Client id (if any)</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.client_id && errors.client_id)}
                    id="client_id-signup"
                    type="text"
                    value={values.client_id}
                    name="client_id"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Client id"
                  />
                  {touched.client_id && errors.client_id && (
                    <FormHelperText error id="helper-text-client_id-signup">
                      {errors.client_id}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="cost_center">Cost Center (if any)</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.cost_center && errors.cost_center)}
                    id="cost_center"
                    type="text"
                    value={values.cost_center}
                    name="cost_center"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.cost_center && errors.cost_center && (
                    <FormHelperText error id="helper-text-cost_center">
                      {errors.cost_center}
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
