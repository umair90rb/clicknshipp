import { useEffect, useRef, useState } from 'react';
import { Box, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { userService } from 'api/index';
import { addUser, updateUser } from 'store/slices/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { brandBrandsSelector, brandIsLoadingSelector } from 'store/slices/brand/brandSelector';
import FormHelperTextComponent from 'components/FormHelperTextComponent';
import CustomDialog from 'components/CustomDialog';
import CustomButton from 'components/CustomButton';
import CustomCheckbox from 'components/CustomCheckbox';
import CustomChipSelect from 'components/CustomChipSelect';
import useBrandsFetch from 'hooks/useBrandsFetch';
import useRolesFetch from 'hooks/useRolesFetch';
import useStoreLocationFetch from 'hooks/useStoreLocationFetch';
import { locationIsLoadingSelector, locationListSelector } from 'store/slices/location/locationSelector';
import { aclRolesIsLoadingSelector, aclRolesListSelector } from 'store/slices/acl/aclSelector';
import { getMetafieldValues } from './util';
import RoleSelectorInput from 'ui/RoleSelectorInput';

export default function AddUpdateUserModal({ visible, onClose, userToUpdate }) {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roles: [],
    brands: [],
    storeAccess: false,
    stores: []
  });
  const brands = useSelector(brandBrandsSelector);
  const brandsIsLoading = useSelector(brandIsLoadingSelector);
  const roles = useSelector(aclRolesListSelector);
  const rolesIsLoading = useSelector(aclRolesIsLoadingSelector);
  const storeLocations = useSelector(locationListSelector);
  const storeLocationsIsLoading = useSelector(locationIsLoadingSelector);

  const [level, setLevel] = useState();
  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    let response;
    try {
      if (Object.values(userToUpdate).length) {
        const { id, permissions, ...rest } = values;
        response = await userService.fetchUpdateUser(userToUpdate.id, rest);
        console.log(response);
        dispatch(updateUser({ data: response.data.user }));
      } else {
        response = await userService.fetchAddUser(values);
        dispatch(addUser(response.data.user));
      }
      setStatus({ success: false });
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.response.data.error });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    changePassword('');
    if (Object.values(userToUpdate).length) {
      console.log(userToUpdate.metafield, getMetafieldValues(userToUpdate.metafield, 'store_access', 'store_id'));
      const { settings, metafield, ...user } = userToUpdate;
      setInitialValues({
        ...user,
        brands: userToUpdate.brands.map((b) => b.id),
        roles: userToUpdate.roles.map((r) => r.id),
        storeAccess: Boolean(userToUpdate.settings?.store_access),
        stores: getMetafieldValues(userToUpdate.metafield, 'store_access', 'store_id')
      });
    } else {
      setInitialValues({
        name: '',
        email: '',
        phone: '',
        password: '',
        roles: [],
        brands: [],
        storeAccess: false,
        stores: []
      });
    }
  }, [visible]);

  useBrandsFetch();
  const { refresh: refreshRoles } = useRolesFetch();
  useStoreLocationFetch();

  return (
    <CustomDialog
      title="Create/Update User"
      visible={visible}
      onClose={onClose}
      maxWidth="lg"
      actions={[{ disabled: formRef.current?.isSubmitting, text: 'Create/Update User Account', onClick: formRef.current?.handleSubmit }]}
    >
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('First Name is required'),
          phone: Yup.number().min(11),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().when({
            is: (val) => (userToUpdate && 'id' in userToUpdate ? false : true),
            then: Yup.string()
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special (@$!%*?&) case character'
              )
              .required('Password is required'),
            otherwise: Yup.string().max(255)
          }),
          roles: Yup.array().of(Yup.string()).min(1).required('Minimum 1 role is required'),
          brands: Yup.array().of(Yup.string())
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">Name*</InputLabel>
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
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@sukoon.com"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone-signup">Phone*</InputLabel>
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
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">
                    <Grid container spacing={2} alignItems="center">
                      <Grid item> Password </Grid>
                      <Grid item>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" fontSize="0.75rem">
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <RemoveRedEyeOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                    inputProps={{}}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <CustomChipSelect
                  multiple
                  fullWidth
                  getLabelFromOptions
                  loading={brandsIsLoading}
                  label="Brands*"
                  error={Boolean(touched.brands && errors.brands)}
                  value={values.brands}
                  name="brands"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  options={brands.map((b) => ({ label: b.name, value: b.id }))}
                />
              </Grid>
              <Grid item xs={12}>
                <RoleSelectorInput
                  error={touched.roles && errors.roles}
                  value={values.roles}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiple
                />
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={2}>
                  <Box sx={{ marginTop: 1.5 }} />
                  <CustomCheckbox
                    label="Store Access"
                    checked={values.storeAccess}
                    onChange={() => setFieldValue('storeAccess', !values.storeAccess)}
                  />
                </Grid>
                <Grid item xs={10}>
                  <CustomChipSelect
                    multiple
                    getLabelFromOptions
                    disabled={!values.storeAccess}
                    error={Boolean(touched.stores && errors.stores)}
                    loading={storeLocationsIsLoading}
                    label="Select Stores"
                    value={values.stores}
                    name="stores"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    options={storeLocations.map((l) => ({ label: l.name, value: l.id }))}
                  />
                </Grid>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperTextComponent id="submits" error={errors.submit} />
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Formik>
    </CustomDialog>
  );
}
