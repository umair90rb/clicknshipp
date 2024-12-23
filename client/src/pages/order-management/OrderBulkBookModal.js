import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack, FormHelperText, ListItemText, InputLabel, Button, Select, MenuItem, Box, Modal, Typography } from '@mui/material';
import { setMessage } from 'store/slices/util/utilSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchAllOrder, fetchImportOrder, fetchOrderBulkBook } from 'store/slices/order/fetchOrder';
import FormHelperTextComponent from 'components/LoadingHelperText';
import fetchStatus from 'constants/fetchStatuses';
import {
  deliveryServiceAccountsFetchStatusSelector,
  deliveryServiceAccountsListSelector
} from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';
import { fetchDeliveryServiceAccounts } from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';

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

export default function OrderBulkBookModal({ visible, onClose, orderIds }) {
  const dispatch = useDispatch();
  const deliveryServiceAccountsList = useSelector(deliveryServiceAccountsListSelector);
  const deliveryServiceAccountsFetchStatus = useSelector(deliveryServiceAccountsFetchStatusSelector);
  const deliveryServiceAccountsIsLoading = deliveryServiceAccountsFetchStatus === fetchStatus.REQUEST;

  const createOrderBulkBooking = async (values) => {
    const { type, payload } = await dispatch(fetchOrderBulkBook({ body: values }));
    if (type === 'order/bulkBook/fetch/fulfilled') {
      dispatch(setMessage({ message: payload?.data?.message || 'Order add to queue for booking', type: 'success' }));
      onClose();
    } else if (type === 'order/bulkBook/fetch/rejected') {
      dispatch(setMessage({ message: payload?.error || 'Error! Something goes wrong!', type: 'error' }));
    }
  };

  const orderBulkBookForm = useFormik({
    initialValues: {
      orderIds: orderIds || [],
      deliveryAccountId: null
    },
    validationSchema: Yup.object({
      orderIds: Yup.mixed().required('Please select orders to book!'),
      deliveryAccountId: Yup.number().required('Please select courier service!')
    }),
    onSubmit: createOrderBulkBooking
  });

  useEffect(() => {
    if (visible) {
      orderBulkBookForm.handleReset();
      if (deliveryServiceAccountsFetchStatus !== fetchStatus.SUCCESS) {
        dispatch(fetchDeliveryServiceAccounts());
      }
    }
  }, [visible]);

  return (
    <Modal open={visible} onClose={onClose}>
      <Box sx={style}>
        <Typography display="flex" justifyContent="center" alignItems="center">
          Book Orders (Selected Orders {orderIds.length})
        </Typography>

        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="deliveryAccountId-signup">Chanel</InputLabel>
            <Select
              fullWidth
              error={Boolean(orderBulkBookForm.touched.deliveryAccountId && orderBulkBookForm.errors.deliveryAccountId)}
              id="deliveryAccountId-signup"
              value={orderBulkBookForm.values.deliveryAccountId}
              name="deliveryAccountId"
              onBlur={orderBulkBookForm.handleBlur}
              onChange={orderBulkBookForm.handleChange}
              labelId="deliveryAccountId-signup"
            >
              {deliveryServiceAccountsList.map(({ name, id }, index) => (
                <MenuItem key={index} value={id}>
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperTextComponent loading={deliveryServiceAccountsIsLoading} />
            {orderBulkBookForm.touched.deliveryAccountId && orderBulkBookForm.errors.deliveryAccountId && (
              <FormHelperText error id="helper-text-deliveryAccountId-signup">
                {orderBulkBookForm.errors.deliveryAccountId}
              </FormHelperText>
            )}
          </Stack>
        </Grid>

        <Grid container spacing={1} mt={5}>
          <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
            <Button
              onClick={orderBulkBookForm.handleSubmit}
              sx={{ flexGrow: 1 }}
              disable={deliveryServiceAccountsIsLoading}
              variant="contained"
            >
              Book
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
