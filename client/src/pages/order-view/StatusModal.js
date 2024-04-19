import React, { useRef } from 'react';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';
import { fetchUpdateStatusOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import { Button, MenuItem, Select, FormHelperText, Grid, ListItemText, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { toSentense } from 'utils/string-utils';

const ORDER_STATUSES = ['Confirmed', 'No Pick', 'Cancel', 'Duplicate'];

export default function StatusModal({ orderId, hideOrderStatusModal }) {
  const dispatch = useDispatch();
  const formRef = useRef();

  const updateOrderStatus = async (values, { setErrors, setStatus, setSubmitting }) => {
    console.log(values);
    setSubmitting(true);
    return dispatch(fetchUpdateStatusOrder({ body: { orderId, ...values } })).then(({ type, payload }) => {
      setSubmitting(false);
      if (type === 'order/status/fetch/fulfilled') {
        setStatus({ success: true });
        hideOrderStatusModal();
        return dispatch(setMessage({ message: `Order status updated successfully`, type: 'success' }));
      }
      setErrors({ submit: toSentense(payload.error) || `Error! Order status can't updated.` });
      setStatus({ success: false });
    });
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          orderId,
          status: '',
          reason: '',
          remarks: ''
        }}
        validationSchema={Yup.object().shape({
          status: Yup.string().required('Status is required'),
          reason: Yup.string().when('status', {
            is: (val) => val === 'Cancel',
            then: Yup.string().required('Reason is required when status is Cancel'),
            otherwise: Yup.string().notRequired()
          }),
          remarks: Yup.string()
        })}
        onSubmit={updateOrderStatus}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, setFieldTouched, setFieldValue, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="status-signup">Status</InputLabel>
                  <Select
                    fullWidth
                    error={Boolean(touched.status && errors.status)}
                    id="status-signup"
                    value={values.status}
                    name="status"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      if (e.target.value !== 'Cancel') {
                        setFieldValue('reason', '');
                      }
                      setFieldTouched('status', true);
                      handleChange(e);
                    }}
                    inputProps={{}}
                    labelId="status-signup"
                  >
                    {ORDER_STATUSES.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        <ListItemText primary={status} />
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.status && errors.status && (
                    <FormHelperText error id="helper-text-status-signup">
                      {errors.status}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {touched.status && values.status === 'Cancel' && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="reason-signup">Cancel Reason</InputLabel>
                    <OutlinedInput
                      fullWidth
                      multiline
                      rows={4}
                      error={Boolean(touched.reason && errors.reason)}
                      id="reason-signup"
                      value={values.reason}
                      name="reason"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Add order cancel reason"
                      inputProps={{}}
                    />
                    {touched.reason && errors.reason && (
                      <FormHelperText error id="helper-text-reason-signup">
                        {errors.reason}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="remarks-signup">Remarks</InputLabel>
                  <OutlinedInput
                    fullWidth
                    multiline
                    rows={2}
                    error={Boolean(touched.remarks && errors.remarks)}
                    id="remarks-login"
                    type="remarks"
                    value={values.remarks}
                    name="remarks"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="any..."
                    inputProps={{}}
                  />
                  {touched.remarks && errors.remarks && (
                    <FormHelperText error id="helper-text-remarks-signup">
                      {errors.remarks}
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
                    Update Order Status
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
