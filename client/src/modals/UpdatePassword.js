import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import CustomDialog from 'components/CustomDialog';
import { InputAdornment, IconButton, Divider, OutlinedInput, Button, FormHelperText, Grid, FormControl, FormLabel } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, ErrorMessage } from 'formik';
import {
  authUpdatePasswordErrorSelector,
  authUpdatePasswordFetchStatusSelector,
  authUpdatePasswordIsLoadingSelector,
  authUpdatePasswordVisibleSelector
} from 'store/slices/auth/authSelector';
import { setAuthUpdatePasswordVisible } from 'store/slices/auth/authSlice';
import { fetchUpdatePassword } from 'store/index';
import fetchStatus from 'constants/fetchStatuses';
import { setMessage } from 'store/slices/util/utilSlice';

export default function UpdatePassword() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [passwordVisibility, setPasswordVisibility] = useState({ current: false, password: false, confirm: false });
  const isVisible = useSelector(authUpdatePasswordVisibleSelector);
  const error = useSelector(authUpdatePasswordErrorSelector);
  const isLoading = useSelector(authUpdatePasswordIsLoadingSelector);
  const updatePasswordFetchStatus = useSelector(authUpdatePasswordFetchStatusSelector);

  const handleOnClose = () => dispatch(setAuthUpdatePasswordVisible(false));
  const handleTogglePasswordVisibility = (type) => setPasswordVisibility((ps) => ({ ...ps, [type]: !ps[type] }));

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (values, actions) => {
    console.log(formRef.current);
    dispatch(fetchUpdatePassword({ body: values }));
  };

  useEffect(() => {
    if (error && formRef.current) {
      console.log(formRef.current.setFieldError);
      formRef.current.setFieldError('current_password', error);
    }
  }, [error]);

  useEffect(() => {
    if (updatePasswordFetchStatus === fetchStatus.SUCCESS) {
      dispatch(setMessage({ message: 'Password updated successfully!', type: 'success' }));
    }
  }, [updatePasswordFetchStatus]);

  return (
    <CustomDialog
      visible={isVisible}
      onClose={handleOnClose}
      maxWidth="sm"
      title="Update Password"
      actions={[{ text: 'Update', onClick: formRef.current?.handleSubmit, disabled: isLoading }]}
    >
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={{
          current_password: '',
          password: '',
          confirm_password: ''
        }}
        validationSchema={Yup.object().shape({
          current_password: Yup.string().required('Please enter current password!'),
          password: Yup.string().min(8).required('Please enter password!'),
          confirm_password: Yup.string()
            .required('Please enter confirm password!')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
        })}
        onSubmit={handleSubmit}
      >
        {(updatePassword) => (
          <Grid container justifyContent="center" spacing={1} item xs={12}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <FormLabel id="current_password">Current Password</FormLabel>
                <OutlinedInput
                  fullWidth
                  size="small"
                  labelId="current_password"
                  id="current_password"
                  value={updatePassword.values.current_password}
                  name="current_password"
                  type={passwordVisibility.current ? 'password' : 'text'}
                  onChange={updatePassword.handleChange}
                  error={updatePassword.touched.current_password && !!updatePassword.errors.current_password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={(e) => handleTogglePasswordVisibility('current')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {passwordVisibility.current ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter Current password"
                />
                <ErrorMessage
                  name="current_password"
                  render={(msg) => (
                    <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                      {msg}
                    </FormHelperText>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <FormLabel id="password">Password</FormLabel>
                <OutlinedInput
                  fullWidth
                  size="small"
                  labelId="password"
                  id="password"
                  value={updatePassword.values.password}
                  name="password"
                  type={passwordVisibility.password ? 'password' : 'text'}
                  onChange={updatePassword.handleChange}
                  error={updatePassword.touched.password && !!updatePassword.errors.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={(e) => handleTogglePasswordVisibility('password')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {passwordVisibility.password ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter New password"
                />
                <ErrorMessage
                  name="password"
                  render={(msg) => (
                    <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                      {msg}
                    </FormHelperText>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <FormLabel id="confirm_password">Confirm Password</FormLabel>
                <OutlinedInput
                  fullWidth
                  size="small"
                  labelId="confirm_password"
                  id="confirm_password"
                  value={updatePassword.values.confirm_password}
                  name="confirm_password"
                  type={passwordVisibility.confirm ? 'password' : 'text'}
                  onChange={updatePassword.handleChange}
                  error={updatePassword.touched.confirm_password && !!updatePassword.errors.confirm_password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={(e) => handleTogglePasswordVisibility('confirm')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {passwordVisibility.confirm ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Confirm password"
                />
                <ErrorMessage
                  name="confirm_password"
                  render={(msg) => (
                    <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                      {msg}
                    </FormHelperText>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Formik>
    </CustomDialog>
  );
}
