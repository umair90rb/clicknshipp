import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Grid,
  ListItemText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Checkbox,
  Chip
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
// import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { roleService } from 'api/roleService/index';
import { userService } from 'api/index';
import { addUser, updateUser } from 'store/slices/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { userUpdateUserData } from 'store/slices/user/userSelector';
import { fetchAllRoles } from 'store/slices/role/fetchRole';

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const userUpdateData = useSelector(userUpdateUserData);
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const fetchRoles = async () => {
    setLoadingRoles(true);
    const { type, payload } = await dispatch(fetchAllRoles());
    if (type === 'role/all/fetch/fulfilled') {
      setRoles(payload.data.roles);
    }
    setLoadingRoles(false);
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    const roleIds = [];
    values.roles.forEach((role) => {
      const index = roles.findIndex((r) => r.name === role);
      if (index > -1) {
        console.log(roles[index]);
        roleIds.push(roles[index].id);
        return;
      }
    });
    const body = { ...values, roles: roleIds };
    let response;
    try {
      if (userUpdateData.data === null) {
        response = await userService.fetchAddUser(body);
        dispatch(addUser(response.data.user));
      } else {
        response = await userService.fetchUpdateUser(userUpdateData.data.id, body);
        dispatch(updateUser({ data: response.data.user }));
      }
      setStatus({ success: false });
      setSubmitting(false);
    } catch (err) {
      console.error(err, err.response.data.error);
      setStatus({ success: false });
      setErrors({ submit: err.response.data.error });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    changePassword('');
    fetchRoles();

    if (userUpdateData.data !== null) {
      console.log(userUpdateData.data, 'userUpdateData.data');
      const { email, name, phone, roles } = userUpdateData.data;
      formRef.current.initialValues.email = email;
      formRef.current.initialValues.name = name;
      formRef.current.initialValues.phone = phone;
      formRef.current.initialValues.roles = roles;
    }
  }, []);

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          name: '',
          email: '',
          phone: '',
          password: '',
          roles: []
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('First Name is required'),
          phone: Yup.number().min(11).required('Phone is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          roles: Yup.array().of(Yup.string()).min(1).required('Minimum 1 role is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">Name*</InputLabel>
                  <OutlinedInput
                    id="name-login"
                    type="name"
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
              {!loadingRoles && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="roles-signup">Roles*</InputLabel>
                    <Select
                      fullWidth
                      multiple
                      error={Boolean(touched.roles && errors.roles)}
                      id="roles-signup"
                      value={values.roles}
                      name="roles"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                      labelId="roles-signup"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      11``
                      {roles.map(({ name }, index) => (
                        <MenuItem key={index} value={name}>
                          <Checkbox checked={values.roles.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.roles && errors.roles && (
                      <FormHelperText error id="helper-text-roles-signup">
                        {errors.roles}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password</InputLabel>
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
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              {/* <Grid item xs={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid> */}
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {userUpdateData.data === null ? 'Create Account' : 'Update Account'}
                  </Button>
                </AnimateButton>
              </Grid>
              {/* <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption">Sign up with</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <FirebaseSocial />
              </Grid> */}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
