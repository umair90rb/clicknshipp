import { Button, Stack, FormHelperText, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { fetchAddEmployeePicture, fetchCreateEmployeeImmediateContact } from 'store/slices/employee/fetchEmployee';
import { toSentence } from 'utils/string-utils';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const PictureForm = ({ employeeId, setStep }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    const { type, payload } = await dispatch(fetchAddEmployeePicture({ body: values }));
    if (type === 'employee/picture/add/fetch/fulfilled') {
      setSubmitting(false);
      setStep((step) => ++step);
    } else {
      setStatus({ success: false });
      setErrors({ submit: payload.error.map((e) => toSentence(e)).join('. ') || 'Employee picture not added!' });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        employee_id: employeeId,
        picture: null
      }}
      validationSchema={Yup.object().shape({
        employee_id: Yup.number().required('Please add employee personal info in previous step first'),
        picture: Yup.mixed().required('Please select picture to upload')
      })}
      onSubmit={handleSubmit}
    >
      {(addPictureForm) => (
        <Grid container mt={5}>
          <Grid container justifyContent="center">
            <Stack spacing={1}>
              <Button component="label" variant="contained">
                {(addPictureForm.values.picture && addPictureForm.values.picture.name) || 'Select picture (Not Selected) (4mb)'}
                <VisuallyHiddenInput
                  type="file"
                  name="picture"
                  onChange={(e) => {
                    addPictureForm.setFieldValue('picture', e.target.files[0]);
                  }}
                />
              </Button>
              {addPictureForm.touched.picture && addPictureForm.errors.picture && (
                <FormHelperText error id="helper-text-picture">
                  {addPictureForm.errors.picture}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          {addPictureForm.errors.submit && (
            <Grid container item justifyContent="center" alignItems="center">
              <Grid item xs={12} container justifyContent="start" alignItems="center">
                <FormHelperText error>{addPictureForm.errors.submit}</FormHelperText>
              </Grid>
            </Grid>
          )}

          <Grid container item justifyContent="space-between" alignItems="center">
            <Grid item xs={2}>
              <Button onClick={() => setStep((step) => ++step)} fullWidth variant="contained">
                Skip
              </Button>
            </Grid>
            <Grid item mt={1} xs={4}>
              <Button onClick={addPictureForm.handleSubmit} fullWidth variant="contained" disabled={addPictureForm.isSubmitting}>
                Add Picture
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
};

export default PictureForm;
