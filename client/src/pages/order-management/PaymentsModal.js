import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, MenuItem, Select, FormHelperText, Grid, ListItemText, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';

const PAYMENT_TYPES = [
  { id: 0, label: 'Receive Advanced Payment', type: 'received' },
  { id: 1, label: 'Received Advanced Delivery Charges', type: 'received' },
  { id: 2, label: 'Pending Delivery Charges', type: 'pending' }
];

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

export default function PaymentsModal({ visible, onClose, orderId, payments }) {
  const dispatch = useDispatch();
  const [addingItem, setAddingPayment] = useState(false);

  const handleAddItem = async (values, actions) => {
    setAddingPayment(true);
    const { type, payload } = await dispatch(fetchUpdateItemsInOrder({ body: values }));
    if (type === 'order/updateItems/fetch/fulfilled') {
      dispatch(setMessage({ type: 'success', message: payload?.data?.message || 'Success! Item updated in order' }));
      dispatch(setOrder({ order: payload?.data?.order }));
      onClose();
    } else {
      dispatch(setMessage({ type: 'error', message: payload?.data?.message || 'Error! Item can not updated in order' }));
    }
    setAddingPayment(false);
  };

  const handleSubmit = (values, actions) => {};

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Formik
          initialValues={{
            label: '',
            type: '',
            bank: '',
            tid: '',
            amount: '',
            note: ''
          }}
          validationSchema={Yup.object().shape({
            type: Yup.string().required('Type is required'),
            bank: Yup.string(),
            tid: Yup.string(),
            amount: Yup.number().required('Amount is required'),
            note: Yup.string('Note is required')
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="type-signup">Type</InputLabel>
                    <Select
                      fullWidth
                      error={Boolean(touched.type && errors.type)}
                      id="type-signup"
                      value={values.type}
                      type="text"
                      name="type"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const option = PAYMENT_TYPES.find((pt) => pt.id === e.target.value);
                        setFieldValue('label', option?.label);
                        setFieldValue('type', option?.type);
                      }}
                      renderValue={(_value) => values.label}
                      inputProps={{}}
                      labelId="type-signup"
                    >
                      {PAYMENT_TYPES.map(({ id, label, type }, index) => (
                        <MenuItem key={index} value={id}>
                          <ListItemText primary={`${label} (${type})`} />
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.type && errors.type && (
                      <FormHelperText error id="helper-text-type-signup">
                        {errors.type}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="bank-signup">Bank</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.bank && errors.bank)}
                      id="bank-signup"
                      type="text"
                      value={values.bank}
                      name="bank"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Jazzcash"
                      inputProps={{}}
                    />
                    {touched.bank && errors.bank && (
                      <FormHelperText error id="helper-text-bank-signup">
                        {errors.bank}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="tid-signup">Transaction Id</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.tid && errors.tid)}
                      id="tid-login"
                      type="text"
                      value={values.tid}
                      name="tid"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="00876732"
                      inputProps={{}}
                    />
                    {touched.tid && errors.tid && (
                      <FormHelperText error id="helper-text-tid-signup">
                        {errors.tid}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="amount-signup">Amount</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.amount && errors.amount)}
                      id="amount-login"
                      type="number"
                      value={values.amount}
                      name="amount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="250"
                      inputProps={{}}
                    />
                    {touched.amount && errors.amount && (
                      <FormHelperText error id="helper-text-amount-signup">
                        {errors.amount}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="note-signup">Note</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.note && errors.note)}
                      id="note-login"
                      type="text"
                      value={values.note}
                      name="note"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="any..."
                      inputProps={{}}
                    />
                    {touched.note && errors.note && (
                      <FormHelperText error id="helper-text-note-signup">
                        {errors.note}
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
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Add Payment
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
