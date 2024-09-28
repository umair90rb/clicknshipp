import { useRef } from 'react';
import { Box, Button, MenuItem, Select, FormHelperText, Grid, ListItemText, InputLabel, Stack, Checkbox, Chip } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRole, fetchUpdateRole } from 'store/slices/acl/fetchACL';
import { setMessage } from 'store/slices/util/utilSlice';
import {
  aclPermissionsIsLoadingSelector,
  aclPermissionsListSelector,
  aclRolesIsLoadingSelector,
  aclRolesListSelector
} from 'store/slices/acl/aclSelector';
import FormHelperTextComponent from 'components/LoadingHelperText';

const UpdateRoleForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const rolesIsLoading = useSelector(aclRolesIsLoadingSelector);
  const roles = useSelector(aclRolesListSelector);
  const permissionsIsLoading = useSelector(aclPermissionsIsLoadingSelector);
  const permissions = useSelector(aclPermissionsListSelector);

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
          role: Yup.object().shape({ id: Yup.number(), name: Yup.string() }).required('Role name is required'),
          permissions: Yup.array().of(Yup.string()).min(1).required('Minimum 1 permission is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setValues }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
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
                  <FormHelperTextComponent loading={rolesIsLoading} />
                  {touched.role && errors.role && (
                    <FormHelperText error id="helper-text-role-signup">
                      {errors.role}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="permissions-signup">Permissions</InputLabel>
                  <Select
                    fullWidth
                    multiple
                    error={Boolean(touched.permissions && errors.permissions)}
                    id="permissions-signup"
                    value={values.permissions}
                    name="permissions"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                    labelId="permissions-signup"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => (
                          <Chip key={id} label={permissions.find((p) => p.id === id).name} />
                        ))}
                      </Box>
                    )}
                  >
                    {permissions.map(({ id, name }, index) => (
                      <MenuItem key={index} value={id}>
                        <Checkbox checked={values.permissions.indexOf(id) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperTextComponent loading={permissionsIsLoading} />
                  {touched.permissions && errors.permissions && (
                    <FormHelperText error id="helper-text-permissions-signup">
                      {errors.permissions}
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
