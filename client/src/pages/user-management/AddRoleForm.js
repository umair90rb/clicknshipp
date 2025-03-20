import { useRef } from 'react';
import { Button, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch } from 'react-redux';
import { fetchCreateRole } from 'store/slices/acl/fetchACL';
import { setMessage } from 'store/slices/util/utilSlice';
import FormHelperTextComponent from 'components/FormHelperTextComponent';
import PermissionSelectorInput from 'ui/PermissionSelectorInput';

const AddRoleForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const handleSubmit = async ({ name, permissions }, { setErrors, setStatus, setSubmitting }) => {
    const body = { name, permissions };
    const { type, payload } = await dispatch(fetchCreateRole({ body }));
    if (type === 'role/create/fetch/fulfilled') {
      setSubmitting(false);
      dispatch(setMessage({ message: 'Role created successfully!' }));
      closeModal();
    } else {
      setStatus({ success: false });
      setErrors({ submit: payload.error || 'Role creation failed!' });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          name: '',
          permissions: []
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Role name is required'),
          permissions: Yup.array().of(Yup.string()).min(1).required('Minimum 1 permission is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">Role Name</InputLabel>
                  <OutlinedInput
                    id="name-login"
                    type="name"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Editor"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                  <FormHelperTextComponent id="name" error={touched.name && errors.name} />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <PermissionSelectorInput
                  value={values.permissions}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.permissions && errors.permissions}
                />
              </Grid>

              <Grid item xs={12}>
                <FormHelperTextComponent id="submit" error={errors.submit} />
              </Grid>

              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Role
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

export default AddRoleForm;
