import { useRef } from 'react';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch } from 'react-redux';
import { fetchCreateSupplier, fetchUpdateSupplier } from 'store/slices/supplier/fetchSupplier';
import { createSupplier, updateSupplier } from 'store/slices/supplier/supplierSlice';

const AddSupplierForm = ({ supplier }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (supplier) {
      return dispatch(fetchUpdateSupplier({ id: supplier.id, body: values })).then((action) => {
        if (action.type === 'supplier/update/fetch/fulfilled') {
          dispatch(updateSupplier(action.payload.data.supplier));
          dispatch(setMessage({ message: 'Supplier updated successfully.', type: 'success' }));
        } else {
          setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
        }
      });
    }
    return dispatch(fetchCreateSupplier({ body: values })).then((action) => {
      console.log(action, fetchCreateSupplier.fulfilled);
      if (action.type === 'supplier/create/fetch/fulfilled') {
        dispatch(createSupplier(action.payload.data.supplier));
      } else {
        setErrors({ submit: action.payload.error || 'Please try again' });
      }
    });
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          name: supplier?.name || '',
          phone: supplier?.phone || '',
          company: supplier?.company || '',
          account_number: supplier?.account_number || ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          phone: Yup.string().max(255).required('Phone is required'),
          company: Yup.string().max(255).nullable(),
          account_number: Yup.string().max(255)
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">Name</InputLabel>
                  <OutlinedInput
                    id="name-login"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Ali"
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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone-signup">Phone</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.phone && errors.phone)}
                    id="phone-signup"
                    value={values.phone}
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="03001234567"
                    inputProps={{}}
                  />
                  {touched.phone && errors.phone && (
                    <FormHelperText error id="helper-text-phone-signup">
                      {errors.phone}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="account_number-signup">Account Number</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.account_number && errors.account_number)}
                    id="account_number-login"
                    type="account_number"
                    value={values.account_number}
                    name="account_number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@sukoon.com"
                    inputProps={{}}
                  />
                  {touched.account_number && errors.account_number && (
                    <FormHelperText error id="helper-text-account_number-signup">
                      {errors.account_number}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Company</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.company && errors.company)}
                    id="company-signup"
                    type={'text'}
                    value={values.company}
                    name="company"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    placeholder="ABC Inc"
                  />
                  {touched.company && errors.company && (
                    <FormHelperText error id="helper-text-company-signup">
                      {errors.company}
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
                    {supplier ? 'Update Supplier Account' : 'Create Supplier Account'}
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

export default AddSupplierForm;
