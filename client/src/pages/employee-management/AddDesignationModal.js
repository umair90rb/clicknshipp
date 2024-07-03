import { useRef } from 'react';

import { Box, Button, Modal, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch } from 'react-redux';
import { setMessage } from 'store/slices/util/utilSlice';
import { fetchCreateDesignation } from 'store/slices/designation/fetchDesignation';

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

const AddDesignationModal = ({ onClose, visible }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    const { type, payload } = await dispatch(fetchCreateDesignation({ body: values }));
    if (type === 'designation/create/fetch/fulfilled') {
      setSubmitting(false);
      dispatch(setMessage({ message: payload?.data.message || 'Designation created successfully!' }));
      onClose();
    } else {
      setStatus({ success: false });
      setErrors({ submit: payload.error || 'Designation creation failed!' });
      setSubmitting(false);
    }
  };

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Formik
          innerRef={formRef}
          initialValues={{
            name: ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required('Designation name is required')
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name">Designation*</InputLabel>
                    <OutlinedInput
                      id="name"
                      type="name"
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Manager"
                      fullWidth
                      error={Boolean(touched.name && errors.name)}
                    />
                    {touched.name && errors.name && (
                      <FormHelperText error id="helper-text-name">
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
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Create Designation
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
};

export default AddDesignationModal;
