import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { fetchCreateCategory, fetchUpdateCategory } from 'store/slices/category/fetchCategory';
import { createCategory, updateCategory } from 'store/slices/category/categorySlice';
import { fetchCreateBrand, fetchUpdateBrand } from 'store/slices/brand/fetchBrand';
import { createBrand, updateBrand } from 'store/slices/brand/brandSlice';

// ============================|| FIREBASE - REGISTER ||============================ //

const AddUpdateForm = ({ type = '', data }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

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
        initialValues={{
          name: data?.name || ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required(`${type} name is required`)
        })}
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
