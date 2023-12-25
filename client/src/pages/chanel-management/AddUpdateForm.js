import { useRef } from 'react';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch } from 'react-redux';
import { createChanel, updateChanel } from 'store/slices/chanel/chanelSlice';
import { fetchCreateChanel, fetchUpdateChanel } from 'store/slices/chanel/fetchChanel';
import { setMessage } from 'store/slices/util/utilSlice';

const AddUpdateForm = ({ chanelToUpdate }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (chanelToUpdate) {
      return dispatch(fetchUpdateChanel({ id: chanelToUpdate.id, body: values })).then((action) => {
        if (action.type === 'chanel/update/fetch/fulfilled') {
          dispatch(updateChanel(action.payload.data.chanel));
          dispatch(setMessage({ message: 'Chanel updated successfully.', type: 'success' }));
        } else {
          setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
        }
      });
    }
    return dispatch(fetchCreateChanel({ body: values })).then((action) => {
      if (action.type === 'chanel/create/fetch/fulfilled') {
        dispatch(createChanel(action.payload.data.chanel));
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
          name: chanelToUpdate?.name || '',
          source: chanelToUpdate?.source || ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Chanel name is required'),
          source: Yup.string().max(255).required('Source is required')
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
                    placeholder="Whatsapp"
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
                  <InputLabel htmlFor="source-signup">Source</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.source && errors.source)}
                    id="source-signup"
                    value={values.source}
                    name="source"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="exmaple.com"
                    inputProps={{}}
                  />
                  {touched.source && errors.source && (
                    <FormHelperText error id="helper-text-source-signup">
                      {errors.source}
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
                    {chanelToUpdate ? 'Update Chanel' : 'Create Chanel'}
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
