import { useLayoutEffect, useRef } from 'react';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Autocomplete } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import fetchStatus from 'constants/fetchStatuses';
import { TextField } from '../../../node_modules/@mui/material/index';
import { fetchAllStock, fetchCreateStock } from 'store/slices/stock/fetchStock';

const AddStockForm = ({ item = '' }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const itemFetchStatus = useSelector(itemFetchStatusSelector);
  const items = useSelector(itemItemsSelector);
  const itemsIsLoading = itemFetchStatus === fetchStatus.REQUEST;

  useLayoutEffect(() => {
    if (itemFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllItem());
    }
  }, []);

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    console.log(values);
    dispatch(fetchCreateStock({ body: values })).then((action) => {
      console.log(action);
      if (action.type === 'stock/create/fetch/fulfilled') {
        dispatch(fetchAllStock());
      } else {
        setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
      }
    });
  };

  if (itemsIsLoading) {
    return <CenterCircularLoader />;
  }

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          item,
          level: '',
          expiry: '',
          comment: ''
        }}
        validationSchema={Yup.object().shape({
          item: Yup.number().required('Please select item.'),
          level: Yup.number().required('Please enter stock received quantity.'),
          expiry: Yup.date().min(new Date(), 'Expiry date must be later than today!').required('Expiry date is required'),
          comment: Yup.string()
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {!itemsIsLoading && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Autocomplete
                      options={items.map((item) => ({ id: item.id, label: item.name }))}
                      id="open-on-focus"
                      name="item"
                      value={(values.item !== '' && items && items.length && items.find((item) => item.id === values.item).name) || ''}
                      onBlur={handleBlur}
                      onChange={(event, newValue) => {
                        if (newValue === '' || newValue === null) {
                          return;
                        }
                        setFieldValue('item', newValue.id);
                      }}
                      openOnFocus
                      clearOnEscape
                      renderInput={(params) => <TextField {...params} label="Select Item" variant="standard" />}
                    />
                    {touched.item && errors.item && (
                      <FormHelperText error id="helper-text-item-signup">
                        {errors.item}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="level-signup">Item Stock Received</InputLabel>
                  <OutlinedInput
                    id="level-login"
                    type="number"
                    name="level"
                    value={values.level}
                    level="level"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="4"
                    fullWidth
                    error={Boolean(touched.level && errors.level)}
                  />
                  {touched.level && errors.level && (
                    <FormHelperText error id="helper-text-level-signup">
                      {errors.level}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="expiry-signup">Expiry Date</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.expiry && errors.expiry)}
                    id="expiry-signup"
                    type="date"
                    value={values.expiry}
                    name="expiry"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="02/10/2025"
                    inputProps={{}}
                  />
                  {touched.expiry && errors.expiry && (
                    <FormHelperText error id="helper-text-expiry-signup">
                      {errors.expiry}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="comment-signup">Comment</InputLabel>
                  <OutlinedInput
                    id="comment-login"
                    type="text"
                    value={values.comment}
                    name="comment"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Anything that helpful"
                    fullWidth
                    error={Boolean(touched.comment && errors.comment)}
                  />
                  {touched.comment && errors.comment && (
                    <FormHelperText error id="helper-text-comment-signup">
                      {errors.comment}
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
                    {'Add Stock'}
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

export default AddStockForm;
