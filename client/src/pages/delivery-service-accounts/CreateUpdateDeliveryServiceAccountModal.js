import { useRef } from 'react';
import { FormHelperText, Grid, Box } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
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
import CustomInput from 'components/CustomInput';
import CustomDialog from 'components/CustomDialog';
import CustomSelect from 'components/CustomSelect';
import CustomTextarea from 'components/CustomTextarea';
import FormHelperTextComponent from 'components/FormHelperTextComponent';
import { toSentence } from 'utils/string-utils';
import useResetForm from 'hooks/useResetForm';

export default function CreateUpdateDeliveryServiceAccountModal({ visible, onClose, account }) {
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
        enableReinitialize
        initialValues={{
          name: account?.name || '',
          service: account?.service || '',
          key: account?.key || '',
          client_id: account?.client_id || '',
          cost_center: account?.cost_center || '',
          username: account?.username || '',
          password: account?.password || '',
          dispatch_address: account?.dispatch_address || '',
          return_address: account?.return_address || '',
          active: account?.active || true
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Account name is required'),
          service: Yup.string().max(255).required('Service type is required'),
          key: Yup.string().max(255),
          client_id: Yup.string().max(255),
          cost_center: Yup.string().max(255),
          username: Yup.string().max(255),
          password: Yup.string().max(255),
          dispatch_address: Yup.string().max(255),
          return_address: Yup.string().max(255)
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <CustomDialog
            visible={visible}
            onClose={onClose}
            title="Create/Update Delivery Service Account"
            maxWidth="md"
            actions={[{ text: account ? 'Update' : 'Create', onClick: handleSubmit, disabled: isSubmitting }]}
          >
            <form noValidate onSubmit={handleSubmit}>
              <Grid container>
                <Grid item container alignItems="center" justifyContent="center" spacing={1} xs={12}>
                  <Grid item xs={6}>
                    <CustomInput
                      label="Account Name*"
                      error={touched.name && errors.name}
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ marginTop: 1 }} />
                    <CustomSelect
                      label="Select Courier Service*"
                      error={touched.service && errors.service}
                      value={values.service}
                      name="service"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={SERVICES.map(([name, value]) => ({ label: name, value }))}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <CustomInput
                    label="Key"
                    error={touched.key && errors.key}
                    value={values.key}
                    name="key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item container alignItems="center" justifyContent="center" spacing={1} xs={12}>
                  <Grid item xs={6}>
                    <CustomInput
                      label="Client id"
                      error={touched.client_id && errors.client_id}
                      value={values.client_id}
                      name="client_id"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInput
                      label="Cost Center"
                      error={touched.cost_center && errors.cost_center}
                      value={values.cost_center}
                      name="cost_center"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Grid item container alignItems="center" justifyContent="center" spacing={1} xs={12}>
                  <Grid item xs={6}>
                    <CustomInput
                      label="Username"
                      error={touched.username && errors.username}
                      value={values.username}
                      name="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInput
                      label="Password"
                      error={touched.password && errors.password}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Grid item container alignItems="center" justifyContent="center" spacing={1} xs={12}>
                  <Grid item xs={6}>
                    <CustomTextarea
                      label="Dispatch Address"
                      error={Boolean(touched.dispatch_address && errors.dispatch_address)}
                      value={values.dispatch_address}
                      name="dispatch_address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextarea
                      label="Return Address"
                      error={Boolean(touched.return_address && errors.return_address)}
                      value={values.return_address}
                      name="return_address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <FormHelperTextComponent error={toSentence(errors.submit)} />
              </Grid>
            </form>
          </CustomDialog>
        )}
      </Formik>
    </>
  );
}
