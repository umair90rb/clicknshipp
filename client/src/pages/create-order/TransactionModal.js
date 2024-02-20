import React, { useRef, useState } from 'react';

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
import { toSentense } from 'utils/string-utils';

const PAYMENT_TYPES = ['Receive Advanced Payment', 'Received Advanced Delivery Charges', 'Other'];

export default function TransactionModal({ addPayment }) {
  return (
    <>
      <Formik
        initialValues={{
          type: '',
          bank: '',
          tid: '',
          amount: '',
          note: ''
        }}
        validationSchema={Yup.object().shape({
          type: Yup.string().required('Type is required'),
          bank: Yup.string().required('Bank is required'),
          tid: Yup.string().required('Transaction id is required'),
          amount: Yup.number().required('amount is required'),
          note: Yup.string().when('type', {
            is: (val) => val === 'Other',
            then: Yup.string().required('note is required when payment type is Other'),
            otherwise: Yup.string().notRequired()
          })
        })}
        onSubmit={addPayment}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
                    onChange={handleChange}
                    inputProps={{}}
                    labelId="type-signup"
                  >
                    {PAYMENT_TYPES.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        <ListItemText primary={type} />
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
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Add Payment
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
