import { useRef } from 'react';
import { Box, Button, MenuItem, Select, FormHelperText, Grid, ListItemText, InputLabel, Stack, Checkbox, Chip } from '@mui/material';
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
  const handleSubmit = async ({ role: { id, name }, permissions }, { setErrors, setSubmitting }) => {
    const body = { name, permissions };
    const { type, payload } = await dispatch(fetchUpdateRole({ id, body }));
    if (type === 'role/update/fetch/fulfilled') {
      setSubmitting(false);
      dispatch(setMessage({ message: 'Role updated successfully!' }));
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
                {/* <Stack spacing={1}>
                  <InputLabel htmlFor="role-signup">Role</InputLabel>
                  <Select
                    fullWidth
                    error={Boolean(touched.role && errors.role)}
                    id="role-signup"
                    value={values.role.name}
                    name="role"
                    onBlur={handleBlur}
                    onChange={async (e) => {
                      console.log(e.target.value);
                      handleChange(e);
                      const { type, payload } = await dispatch(fetchRole({ id: e.target.value.id }));
                      if (type === 'role/fetch/fulfilled') {
                        setValues((currentValues) => ({
                          ...currentValues,
                          permissions: payload.data.role.permissions.map((p) => p.id)
                        }));
                      }
                    }}
                    inputProps={{}}
                    labelId="role-signup"
                  >
                    {roles.map((role, index) => (
                      <MenuItem key={index} value={role}>
                        <ListItemText primary={role.name} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperTextComponent id="roles" loading={rolesIsLoading} error={touched.role && errors.role} />
                  {touched.role && errors.role && (
                    <FormHelperText error id="helper-text-role-signup">
                      {errors.role}
                    </FormHelperText>
                  )}
                </Stack> */}
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
