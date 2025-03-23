import { useRef } from 'react';
import { Button, Grid } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch } from 'react-redux';
import { fetchRole, fetchUpdateRole } from 'store/slices/acl/fetchACL';
import { setMessage } from 'store/slices/util/utilSlice';
import FormHelperTextComponent from 'components/FormHelperTextComponent';
import PermissionSelectorInput from 'ui/PermissionSelectorInput';
import RoleSelectorInput from 'ui/RoleSelectorInput';

const UpdateRoleForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const handleSubmit = async ({ role, permissions }, { setErrors, setSubmitting }) => {
    const { type, payload } = await dispatch(fetchUpdateRole({ id: role, body: { permissions } }));
    if (type === 'role/update/fetch/fulfilled') {
      setSubmitting(false);
      dispatch(setMessage({ message: 'Role updated successfully', type: 'success' }));
      closeModal();
    } else {
      setErrors({ submit: payload.error || 'Role creation failed!' });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          role: '',
          permissions: []
        }}
        validationSchema={Yup.object().shape({
          role: Yup.number().required('Role name is required'),
          permissions: Yup.array().of(Yup.string()).min(1).required('Minimum 1 permission is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RoleSelectorInput
                  error={touched.role && errors.role}
                  value={values.role}
                  onBlur={handleBlur}
                  onChange={async (e) => {
                    handleChange(e);
                    const { type, payload } = await dispatch(fetchRole({ id: e.target.value }));
                    if (type === 'role/fetch/fulfilled') {
                      setFieldValue(
                        'permissions',
                        payload.data.role.permissions.map((p) => p.id)
                      );
                    }
                  }}
                />
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
                    Update Role
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

export default UpdateRoleForm;
