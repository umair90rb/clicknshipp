import { useRef } from 'react';

import {
  Box,
  Button,
  MenuItem,
  Select,
  FormHelperText,
  Grid,
  ListItemText,
  InputLabel,
  OutlinedInput,
  Stack,
  Checkbox,
  Chip
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch } from 'react-redux';
import { fetchCreateRole } from 'store/slices/acl/fetchACL';
import { setMessage } from 'store/slices/util/utilSlice';
import { useSelector } from '../../../node_modules/react-redux/es/exports';
import { aclPermissionsIsLoadingSelector, aclPermissionsListSelector } from 'store/slices/acl/aclSelector';
import FormHelperTextComponent from 'components/FormHelperTextComponent';

const AddRoleForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const permissions = useSelector(aclPermissionsListSelector);
  const permissionsIsLoading = useSelector(aclPermissionsIsLoadingSelector);

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
                  <FormHelperTextComponent
                    id="permissions"
                    loading={permissionsIsLoading}
                    error={touched.permissions && errors.permissions}
                  />
                </Stack>
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
